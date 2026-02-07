import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { professorsAPI, academicAPI, commentsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [professors, setProfessors] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Transformar datos del backend al formato que espera el frontend
  const transformProfessor = (prof) => ({
    id: prof.id,
    name: prof.full_name || `${prof.first_name} ${prof.last_name}`,
    email: prof.email,
    department: prof.specialty || '',
    subjects: [],
    faculty: '',
    createdAt: prof.created_at,
    // Mantener datos originales del backend
    first_name: prof.first_name,
    last_name: prof.last_name,
    phone: prof.phone,
    identification: prof.identification,
    category: prof.category,
    category_display: prof.category_display,
    scientific_degree: prof.scientific_degree,
    scientific_degree_display: prof.scientific_degree_display,
    contract_type: prof.contract_type,
    contract_type_display: prof.contract_type_display,
    specialty: prof.specialty,
    years_of_experience: prof.years_of_experience,
    is_active: prof.is_active,
  });

  const transformComment = (comment) => ({
    id: comment.id,
    author: comment.author_name || 'Sistema',
    message: comment.message || comment.subject,
    timestamp: new Date(comment.created_at),
    type: comment.comment_type === 'ASSIGNMENT' || comment.comment_type === 'GENERAL'
      ? 'add'
      : comment.comment_type === 'MODIFICATION'
        ? 'edit'
        : 'add',
    // datos originales
    subject: comment.subject,
    comment_type: comment.comment_type,
    author_role: comment.author_role,
    is_read: comment.is_read,
  });

  // Cargar datos al autenticar
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const [profsRes, discRes, commRes] = await Promise.allSettled([
        professorsAPI.getAll(),
        academicAPI.getDisciplines(),
        commentsAPI.getAll(),
      ]);

      if (profsRes.status === 'fulfilled') {
        const profsData = Array.isArray(profsRes.value.data)
          ? profsRes.value.data
          : profsRes.value.data.results || [];
        setProfessors(profsData.map(transformProfessor));
      }

      if (discRes.status === 'fulfilled') {
        const discData = Array.isArray(discRes.value.data)
          ? discRes.value.data
          : discRes.value.data.results || [];
        setDisciplines(discData.map(d => ({
          id: d.id,
          name: d.name,
          faculty: '',
        })));
      }

      if (commRes.status === 'fulfilled') {
        const commData = Array.isArray(commRes.value.data)
          ? commRes.value.data
          : commRes.value.data.results || [];
        setComments(commData.map(transformComment));
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar datos del servidor');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addProfessor = async (professor) => {
    try {
      // Separar nombre en first_name y last_name
      const nameParts = (professor.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const backendData = {
        first_name: firstName,
        last_name: lastName,
        email: professor.email,
        identification: professor.identification || `ID${Date.now()}`,
        category: professor.category || 'INSTRUCTOR',
        scientific_degree: professor.scientific_degree || 'NONE',
        contract_type: professor.contract_type || 'FULL_TIME',
        specialty: professor.department || professor.specialty || '',
        phone: professor.phone || '',
        years_of_experience: professor.years_of_experience || 0,
      };

      const response = await professorsAPI.create(backendData);
      const newProfessor = transformProfessor(response.data);
      setProfessors(prev => [...prev, newProfessor]);
      return newProfessor;
    } catch (err) {
      console.error('Error creando profesor:', err);
      // Fallback local
      const newProfessor = {
        ...professor,
        id: Math.max(...professors.map(p => p.id), 0) + 1,
        createdAt: new Date().toISOString()
      };
      setProfessors(prev => [...prev, newProfessor]);
      return newProfessor;
    }
  };

  const updateProfessor = async (id, updates) => {
    try {
      const backendData = {};
      if (updates.name) {
        const nameParts = updates.name.trim().split(' ');
        backendData.first_name = nameParts[0] || '';
        backendData.last_name = nameParts.slice(1).join(' ') || '';
      }
      if (updates.email) backendData.email = updates.email;
      if (updates.department) backendData.specialty = updates.department;
      if (updates.phone) backendData.phone = updates.phone;
      if (updates.category) backendData.category = updates.category;
      if (updates.scientific_degree) backendData.scientific_degree = updates.scientific_degree;
      if (updates.contract_type) backendData.contract_type = updates.contract_type;

      await professorsAPI.partialUpdate(id, backendData);
      setProfessors(prev => prev.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ));
    } catch (err) {
      console.error('Error actualizando profesor:', err);
      // Fallback local
      setProfessors(prev => prev.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ));
    }
  };

  const deleteProfessor = async (id) => {
    try {
      await professorsAPI.delete(id);
      setProfessors(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error eliminando profesor:', err);
      // Fallback local
      setProfessors(prev => prev.filter(p => p.id !== id));
    }
  };

  const addComment = async (comment) => {
    try {
      const backendData = {
        subject: comment.message?.substring(0, 200) || 'Cambio en el sistema',
        message: comment.message,
        comment_type: comment.type === 'add' ? 'ASSIGNMENT' : 'MODIFICATION',
      };

      const response = await commentsAPI.create(backendData);
      const newComment = transformComment(response.data);
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      console.error('Error creando comentario:', err);
      // Fallback local
      const newComment = {
        ...comment,
        id: Math.max(...comments.map(c => c.id), 0) + 1,
        timestamp: new Date()
      };
      setComments(prev => [...prev, newComment]);
      return newComment;
    }
  };

  const getProfessorsByDiscipline = (disciplineName) => {
    return professors.filter(p => p.department === disciplineName);
  };

  const getProfessorsByFaculty = (facultyName) => {
    return professors.filter(p => p.faculty === facultyName);
  };

  const getProfessorsBySubject = (subjectName) => {
    return professors.filter(p => p.subjects && p.subjects.includes(subjectName));
  };

  const addMessage = (message) => {
    const newMessage = {
      ...message,
      id: Math.max(...messages.map(m => m.id || 0), 0) + 1,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Recargar datos
  const refreshData = () => loadData();

  const value = {
    professors,
    disciplines,
    comments,
    messages,
    loading,
    error,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    addComment,
    getProfessorsByDiscipline,
    getProfessorsByFaculty,
    getProfessorsBySubject,
    addMessage,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
