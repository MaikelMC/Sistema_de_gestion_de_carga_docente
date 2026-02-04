// Utilidades para exportación de datos

export const exportToCSV = (data, columns, filename = 'data.csv') => {
  // Headers
  const headers = columns.map(col => col.label);
  
  // Rows
  const rows = data.map(row => 
    columns.map(col => {
      const value = col.render ? col.render(row) : row[col.key];
      return typeof value === 'string' ? `"${value}"` : value;
    })
  );

  // CSV Content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create Download Link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  
  // Trigger Download
  link.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename = 'data.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  
  link.click();
  URL.revokeObjectURL(url);
};

// Formatear fechas
export const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('es-ES', options);
};

export const formatDateTime = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('es-ES', options);
};

// Validaciones
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

// Búsqueda y filtrado
export const searchData = (data, query, fields) => {
  if (!query) return data;
  
  const lowerQuery = query.toLowerCase();
  return data.filter(item =>
    fields.some(field =>
      String(item[field]).toLowerCase().includes(lowerQuery)
    )
  );
};

// Paginación
export const paginate = (array, pageSize = 10, pageNumber = 1) => {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: array.slice(start, end),
    totalPages: Math.ceil(array.length / pageSize),
    totalItems: array.length
  };
};

// Ordenamiento
export const sortData = (data, field, direction = 'asc') => {
  const sorted = [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === 'string') {
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return direction === 'asc'
      ? aValue - bValue
      : bValue - aValue;
  });

  return sorted;
};

// Notificaciones
export const showNotification = (message, type = 'info', duration = 3000) => {
  // Esta función se puede expandir si usas una librería de notificaciones
  console.log(`[${type.toUpperCase()}]: ${message}`);
};

// LocalStorage
export const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

// Debounce
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
