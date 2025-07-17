import React, { useEffect, useMemo, useRef, useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Select = ({ name, value, label, options = [], onChange, className }) => (
  <div className={`relative ${className}`}>
    {label && (
      <label htmlFor={name} className="mb-2 block font-medium text-gray-700">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-800 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </span>
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-blue-500 shadow-sm',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const EventModal = ({ isOpen, onClose, event, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    start: '',
    end: '',
    allDay: false,
    timezone: false,
    repeat: 'Never',
    description: ''
  });

  useEffect(() => {
    if (event) {
      const formatDateTime = (date) => {
        // Ensure date is a Date object
        const dateObj = date instanceof Date ? date : new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        title: event.title || '',
        location: event.location || '',
        start: event.start ? formatDateTime(event.start) : '',
        end: event.end ? formatDateTime(event.end) : '',
        allDay: event.allDay || false,
        timezone: event.timezone || false,
        repeat: event.repeat || 'Never',
        description: event.description || ''
      });
    } else {
      setFormData({
        title: '',
        location: '',
        start: '',
        end: '',
        allDay: false,
        timezone: false,
        repeat: 'Never',
        description: ''
      });
    }
  }, [event, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    const eventData = {
      ...event,
      title: formData.title,
      location: formData.location,
      start: new Date(formData.start),
      end: new Date(formData.end),
      allDay: formData.allDay,
      timezone: formData.timezone,
      repeat: formData.repeat,
      description: formData.description,
      color: event?.color || 'bg-blue-500'
    };
    onSave(eventData);
    onClose();
  };

  const handleDelete = () => {
    if (event && event.id) {
      onDelete(event.id);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {event?.id ? 'Edit Event' : 'Add Event'}
            </h2>
            {event?.isRecurring && (
              <p className="text-sm text-gray-500 mt-1">
                🔄 This is a recurring event
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 text-black">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Event title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Event location"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start</label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End</label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="allDay"
                checked={formData.allDay}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">All day</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="timezone"
                checked={formData.timezone}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Timezone</span>
            </label>
          </div>

          <div>
            <Select
              name="repeat"
              value={formData.repeat}
              label="Repeat"
              onChange={handleChange}
              options={[
                { name: 'Never', value: 'Never' },
                { name: 'Daily', value: 'Daily' },
                { name: 'Weekly', value: 'Weekly' },
                { name: 'Monthly', value: 'Monthly' },
                { name: 'Yearly', value: 'Yearly' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Event description"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div>
            {event?.id && (
              <Button variant="danger" onClick={handleDelete}>
                DELETE
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose}>
              CANCEL
            </Button>
            <Button onClick={handleSave}>
              SAVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContinuousCalendar = ({ onClick }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [view, setView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch events from backend
  const fetchEvents = async (startDate, endDate) => {
    setLoading(true);
    try {
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        setLoading(false);
        return;
      }
      const response = await fetch(`/api/event?start=${start}&end=${end}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch events:', errorData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let startDate, endDate;
    if (view === 'day') {
      startDate = new Date(currentDate);
      endDate = new Date(currentDate);
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      startDate = startOfWeek;
      endDate = endOfWeek;
    } else {
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      startDate = firstDay;
      endDate = lastDay;
    }
    fetchEvents(startDate, endDate);
  }, [currentDate, view]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDateRange = () => {
    if (view === 'day') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    }
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const getMonthDays = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Helper function to generate recurring events
  const generateRecurringEvents = (event, startDate, endDate) => {
    const recurringEvents = [];
    const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
    const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);
    
    // If event doesn't repeat, just return the original event if it falls within the date range
    if (event.repeat === 'Never') {
      if (eventStart >= startDate && eventStart <= endDate) {
        recurringEvents.push({
          ...event,
          start: eventStart,
          end: eventEnd,
          isRecurring: false
        });
      }
      return recurringEvents;
    }
    
    // Calculate the duration of the event
    const eventDuration = eventEnd.getTime() - eventStart.getTime();
    
    // Generate recurring events based on the repeat pattern
    let currentDate = new Date(eventStart);
    const maxDate = new Date(endDate);
    maxDate.setDate(maxDate.getDate() + 1); // Include the end date
    
    while (currentDate <= maxDate) {
      // Check if this occurrence falls within our date range
      if (currentDate >= startDate && currentDate <= endDate) {
        const newStart = new Date(currentDate);
        const newEnd = new Date(currentDate.getTime() + eventDuration);
        
        // For all-day events, ensure they span the full day
        if (event.allDay) {
          newStart.setHours(0, 0, 0, 0);
          newEnd.setHours(23, 59, 59, 999);
        }
        
        recurringEvents.push({
          ...event,
          start: newStart,
          end: newEnd,
          isRecurring: true,
          originalEventId: event.id
        });
      }
      
      // Move to the next occurrence based on repeat pattern
      switch (event.repeat) {
        case 'Daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'Weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'Monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'Yearly':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        default:
          return recurringEvents; // Exit if unknown repeat pattern
      }
    }
    
    return recurringEvents;
  };

  const getEventsForDate = (date) => {
    // Get the current view's date range to generate recurring events
    let startDate, endDate;
    
    if (view === 'day') {
      startDate = new Date(date);
      endDate = new Date(date);
    } else if (view === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      startDate = startOfWeek;
      endDate = endOfWeek;
    } else {
      // month view
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      startDate = firstDay;
      endDate = lastDay;
    }
    
    // Generate all recurring events for the current view
    const allRecurringEvents = [];
    events.forEach(event => {
      const recurringEvents = generateRecurringEvents(event, startDate, endDate);
      allRecurringEvents.push(...recurringEvents);
    });
    
    // Filter events for the specific date
    return allRecurringEvents.filter(event => {
      const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
      return eventStart.toDateString() === date.toDateString();
    });
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event) => {
    // If this is a recurring event, we need to find the original event
    if (event.isRecurring && event.originalEventId) {
      const originalEvent = events.find(e => e.id === event.originalEventId);
      if (originalEvent) {
        setSelectedEvent(originalEvent);
      } else {
        setSelectedEvent(event);
      }
    } else {
      setSelectedEvent(event);
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const url = eventData.id ? `/api/event/${eventData.id}` : '/api/event';
      const method = eventData.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        const data = await response.json();
        if (eventData.id) {
          setEvents(prev => prev.map(e => e.id === eventData.id ? data.data : e));
        } else {
          setEvents(prev => [...prev, data.data]);
        }
        setIsModalOpen(false);
        // Refresh events after saving
        let startDate = new Date(currentDate);
        let endDate = new Date(currentDate);
        if (view === 'week') {
          startDate.setDate(currentDate.getDate() - currentDate.getDay());
          endDate.setDate(startDate.getDate() + 6);
        } else if (view === 'month') {
          startDate.setDate(1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        }
        fetchEvents(startDate, endDate);
      } else {
        const errorData = await response.json();
        console.error('Failed to save event:', errorData);
        alert('Failed to save event: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event: ' + error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      
      // Check if this is a recurring event
      const eventToDelete = events.find(e => e.id === eventId);
      if (eventToDelete && eventToDelete.repeat !== 'Never') {
        // For recurring events, ask user what to delete
        const deleteChoice = confirm(
          `This is a recurring event. Do you want to:\n\n` +
          `Click OK to delete this event and all future occurrences\n` +
          `Click Cancel to cancel`
        );
        
        if (!deleteChoice) {
          return;
        }
      }
      
      const response = await fetch(`/api/event/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setIsModalOpen(false);
        // Refresh events after deleting
        let startDate = new Date(currentDate);
        let endDate = new Date(currentDate);
        if (view === 'week') {
          startDate.setDate(currentDate.getDate() - currentDate.getDay());
          endDate.setDate(startDate.getDate() + 6);
        } else if (view === 'month') {
          startDate.setDate(1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        }
        fetchEvents(startDate, endDate);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete event:', errorData);
        alert('Failed to delete event: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event: ' + error.message);
    }
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9; // 9 AM to 8 PM
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return {
      hour,
      label: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
      }).replace(':00 ', ' ')
    };
  });

  return (
    <div className="h-[95vh] w-[77vw] bg-gray-50 flex flex-col p-2 rounded-xl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={handlePrevious}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button variant="ghost" onClick={handleNext}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
              <h2 className="text-xl font-semibold text-gray-800 min-w-[200px]">
                {formatDateRange()}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={handleToday}>
              Today
            </Button>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['DAY', 'WEEK', 'MONTH'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType.toLowerCase())}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === viewType.toLowerCase()
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>
            
            <Button onClick={handleAddEvent}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'day' && (
          <div className="h-full flex flex-col">
            {/* Day Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="grid grid-cols-2 gap-0">
                <div className="p-4 border-r border-gray-200">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Time</div>
                </div>
                <div
                  className={`p-4 text-center cursor-pointer hover:bg-gray-50 ${
                    isToday(currentDate) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedDate(currentDate)}
                >
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {daysOfWeek[currentDate.getDay()]}
                  </div>
                  <div className={`text-2xl font-semibold ${
                    isToday(currentDate) 
                      ? 'bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto' 
                      : 'text-gray-900'
                  }`}>
                    {currentDate.getDate()}
                  </div>
                </div>
              </div>
            </div>

            {/* Day Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-0 min-h-full">
                {/* Time Column */}
                <div className="border-r border-gray-200 bg-gray-50">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.hour}
                      className="h-16 px-3 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-start"
                    >
                      {slot.label}
                    </div>
                  ))}
                </div>

                {/* Day Column */}
                <div className="relative">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.hour}
                      className="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                      onClick={() => onClick && onClick(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear())}
                    />
                  ))}
                  
                  {/* Events for this day */}
                  {getEventsForDate(currentDate).map((event) => {
                    // Convert string dates to Date objects if needed
                    const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
                    const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);
                    
                    // Handle all-day events
                    if (event.allDay) {
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 top-0 ${event.color} text-white text-xs p-2 rounded-lg shadow-sm z-10 overflow-hidden cursor-pointer hover:opacity-90`}
                          style={{
                            height: '40px'
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                            {event.isRecurring && (
                              <span className="ml-1 text-xs opacity-75">🔄</span>
                            )}
                          </div>
                          <div className="opacity-90 text-xs">
                            All day
                          </div>
                        </div>
                      );
                    }
                    
                    const startHour = eventStart.getHours();
                    if (startHour < 9 || startHour > 20) return null;
                    
                    const startMinute = eventStart.getMinutes();
                    const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
                    const top = (startHour - 9 + startMinute / 60) * 64;
                    const height = duration * 64;
                    
                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 ${event.color} text-white text-xs p-2 rounded-lg shadow-sm z-10 overflow-hidden cursor-pointer hover:opacity-90`}
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 40)}px`
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-medium truncate">
                          {event.title}
                          {event.isRecurring && (
                            <span className="ml-1 text-xs opacity-75">🔄</span>
                          )}
                        </div>
                        <div className="opacity-90 text-xs">
                          {formatTime(eventStart)} - {formatTime(eventEnd)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'week' && (
          <div className="h-full flex flex-col">
            {/* Week Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="grid grid-cols-8 gap-0">
                <div className="p-4 border-r border-gray-200">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Time</div>
                </div>
                {getWeekDays().map((date, index) => (
                  <div
                    key={index}
                    className={`p-4 text-center border-r border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                      isToday(date) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {daysOfWeek[date.getDay()]}
                    </div>
                    <div className={`text-2xl font-semibold ${
                      isToday(date) 
                        ? 'bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto' 
                        : isSelected(date)
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Week Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-8 gap-0 min-h-full">
                {/* Time Column */}
                <div className="border-r border-gray-200 bg-gray-50">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.hour}
                      className="h-16 px-3 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-start"
                    >
                      {slot.label}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {getWeekDays().map((date, dayIndex) => (
                  <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.hour}
                        className="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                        onClick={() => onClick && onClick(date.getDate(), date.getMonth(), date.getFullYear())}
                      />
                    ))}
                    
                    {/* Events for this day */}
                    {getEventsForDate(date).map((event) => {
                      // Convert string dates to Date objects if needed
                      const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
                      const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);
                      
                      // Handle all-day events
                      if (event.allDay) {
                        return (
                          <div
                            key={event.id}
                            className={`absolute left-1 right-1 top-0 ${event.color} text-white text-xs p-2 rounded-lg shadow-sm z-10 overflow-hidden cursor-pointer hover:opacity-90`}
                            style={{
                              height: '40px'
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium truncate">
                              {event.title}
                              {event.isRecurring && (
                                <span className="ml-1 text-xs opacity-75">🔄</span>
                              )}
                            </div>
                            <div className="opacity-90 text-xs">
                              All day
                            </div>
                          </div>
                        );
                      }
                      
                      const startHour = eventStart.getHours();
                      if (startHour < 9 || startHour > 20) return null;
                      
                      const startMinute = eventStart.getMinutes();
                      const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
                      const top = (startHour - 9 + startMinute / 60) * 64;
                      const height = duration * 64;
                      
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 ${event.color} text-white text-xs p-2 rounded-lg shadow-sm z-10 overflow-hidden cursor-pointer hover:opacity-90`}
                          style={{
                            top: `${top}px`,
                            height: `${Math.max(height, 40)}px`
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                            {event.isRecurring && (
                              <span className="ml-1 text-xs opacity-75">🔄</span>
                            )}
                          </div>
                          <div className="opacity-90 text-xs">
                            {formatTime(eventStart)} - {formatTime(eventEnd)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'month' && (
          <div className="h-full bg-white">
            <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
              {daysOfWeek.map((day) => (
                <div key={day} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-0 flex-1 h-full">
              {getMonthDays().map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const dayEvents = getEventsForDate(date);
                
                return (
                  <div
                    key={index}
                    className={`border-r border-b border-gray-200 p-2 h-32 overflow-hidden cursor-pointer hover:bg-gray-50 ${
                      !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
                    } ${isToday(date) ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday(date) 
                        ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                        : isSelected(date)
                        ? 'text-blue-600'
                        : ''
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`${event.color} text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-90`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          {event.title}
                          {event.isRecurring && (
                            <span className="ml-1 opacity-75">🔄</span>
                          )}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default ContinuousCalendar;