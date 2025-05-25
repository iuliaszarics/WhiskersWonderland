import { useState, useEffect, useCallback } from 'react';
import api from '../api/config.js';

function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [form, setForm] = useState({ name: '', contact_info: '', address: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', contact_info: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [apiError, setApiError] = useState('');

  const fetchShelters = useCallback(async () => {
    try {
      const res = await api.get('/shelters', {
        params: {
          search: searchTerm,
          sortBy,
          order: sortOrder
        },
      });
      setShelters(res.data);
      setApiError('');
    } catch (err) {
      console.error('Error fetching shelters:', err);
      setApiError('Failed to load shelters. Please try again later.');
    }
  }, [searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchShelters();
  }, [fetchShelters]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setApiError('');
  };

  const handleAddShelter = async () => {
    if (!form.name.trim()) {
      setApiError('Shelter name is required');
      return;
    }

    try {
      await api.post('/shelters', form);
      setForm({ name: '', contact_info: '', address: '' });
      fetchShelters();
      setApiError('');
    } catch (err) {
      console.error('Error adding shelter:', err);
      setApiError(err.response?.data?.message || 'Failed to add shelter. Please try again.');
    }
  };

  const handleDeleteShelter = async (id) => {
    try {
      await api.delete(`/shelters/${id}`);
      fetchShelters();
      setApiError('');
    } catch (err) {
      console.error('Error deleting shelter:', err);
      setApiError('Failed to delete shelter. Please try again.');
    }
  };

  const handleSearch = () => {
    fetchShelters();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchShelters();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleEditShelter = (shelter) => {
    setEditForm({ ...shelter });
  };

  const handleUpdateShelter = async () => {
    if (!editForm.name.trim()) {
      setApiError('Shelter name is required');
      return;
    }

    try {
      await api.patch(`/shelters/${editForm.id}`, editForm);
      setEditForm({ id: null, name: '', contact_info: '', address: '' });
      fetchShelters();
      setApiError('');
    } catch (err) {
      console.error('Error updating shelter:', err);
      setApiError('Failed to update shelter. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shelters</h1>
      
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {apiError}
        </div>
      )}

      <p className="mb-4">Search</p>
      {/* Search and Sort */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search by name, contact or address"
          className="border p-2 flex-grow rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Search
        </button>
        <button onClick={handleClearSearch} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">
          Clear
        </button>
      </div>

      {/* Add Shelter Form */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <p className="mb-4 font-semibold">Add Shelter</p>
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            className="border p-2 w-full rounded"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="contact_info"
            placeholder="Contact Info"
            className="border p-2 w-full rounded"
            value={form.contact_info}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            className="border p-2 w-full rounded"
            value={form.address}
            onChange={handleChange}
          />
          <button
            onClick={handleAddShelter}
            className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
          >
            Add Shelter
          </button>
        </div>
      </div>

      {/* Sort Shelters */}
      <p className="mb-4">Sort Shelters</p>
      <div className="mb-4 flex gap-2">
        <label className="font-semibold">Sort by:</label>
        {['id', 'name', 'address', 'contact_info'].map((field) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`px-3 py-1 rounded border ${
              sortBy === field ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
            } transition-colors`}
          >
            {field} {sortBy === field ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
          </button>
        ))}
      </div>

      {/* Shelter List */}
      <p className="mb-4">Shelters</p>
      <ul className="space-y-4">
        {shelters.map((shelter) => (
          <li key={shelter.id} className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                {editForm.id === shelter.id ? (
                  <div className="space-y-4">
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="border p-2 w-full rounded"
                    />
                    <input
                      name="contact_info"
                      value={editForm.contact_info}
                      onChange={handleEditChange}
                      className="border p-2 w-full rounded"
                    />
                    <input
                      name="address"
                      value={editForm.address}
                      onChange={handleEditChange}
                      className="border p-2 w-full rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateShelter}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditForm({ id: null, name: '', contact_info: '', address: '' })}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold">{shelter.name}</h3>
                    <p className="text-gray-600">📞 {shelter.contact_info}</p>
                    <p className="text-gray-600">📍 {shelter.address}</p>
                  </div>
                )}
              </div>
              {editForm.id !== shelter.id && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditShelter(shelter)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteShelter(shelter.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Shelters;
