import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [professors, setProfessors] = useState([
    {
      id: 1,
      name: 'Dr. Juan García',
      email: 'juan.garcia@uci.edu.cu',
      department: 'Programación',
      subjects: ['Python', 'Programación Web'],
      faculty: 'Ingeniería Informática',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Dra. María López',
      email: 'maria.lopez@uci.edu.cu',
      department: 'Base de Datos',
      subjects: ['SQL', 'Modelado de Datos'],
      faculty: 'Ingeniería Informática',
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      name: 'Ing. Carlos Martínez',
      email: 'carlos.martinez@uci.edu.cu',
      department: 'Sistemas',
      subjects: ['Arquitectura de Software'],
      faculty: 'Ingeniería Informática',
      createdAt: '2024-02-01'
    }
  ]);

  const [disciplines, setDisciplines] = useState([
    { id: 1, name: 'Programación', faculty: 'Ingeniería Informática' },
    { id: 2, name: 'Base de Datos', faculty: 'Ingeniería Informática' },
    { id: 3, name: 'Sistemas', faculty: 'Ingeniería Informática' },
    { id: 4, name: 'Redes', faculty: 'Ingeniería Informática' }
  ]);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Jefe de Disciplina Programación',
      message: 'Se agregó Dr. Juan García a la disciplina de Programación',
      timestamp: new Date('2024-01-15'),
      type: 'add'
    },
    {
      id: 2,
      author: 'Jefe de Disciplina Base de Datos',
      message: 'Se modificaron los datos de Dra. María López',
      timestamp: new Date('2024-01-20'),
      type: 'edit'
    }
  ]);

  const [messages, setMessages] = useState([]);

  const addProfessor = (professor) => {
    const newProfessor = {
      ...professor,
      id: Math.max(...professors.map(p => p.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    setProfessors([...professors, newProfessor]);
    return newProfessor;
  };

  const updateProfessor = (id, updates) => {
    setProfessors(professors.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const deleteProfessor = (id) => {
    setProfessors(professors.filter(p => p.id !== id));
  };

  const addComment = (comment) => {
    const newComment = {
      ...comment,
      id: Math.max(...comments.map(c => c.id), 0) + 1,
      timestamp: new Date()
    };
    setComments([...comments, newComment]);
    return newComment;
  };

  const getProfessorsByDiscipline = (disciplineName) => {
    return professors.filter(p => p.department === disciplineName);
  };

  const getProfessorsByFaculty = (facultyName) => {
    return professors.filter(p => p.faculty === facultyName);
  };

  const getProfessorsBySubject = (subjectName) => {
    return professors.filter(p => p.subjects.includes(subjectName));
  };

  const addMessage = (message) => {
    const newMessage = {
      ...message,
      id: Math.max(...messages.map(m => m.id || 0), 0) + 1,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    return newMessage;
  };

  const value = {
    professors,
    disciplines,
    comments,
    messages,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    addComment,
    getProfessorsByDiscipline,
    getProfessorsByFaculty,
    getProfessorsBySubject,
    addMessage
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
