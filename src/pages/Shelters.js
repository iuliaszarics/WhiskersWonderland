import { useState, useEffect } from 'react';
import axios from 'axios';

function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [form, setForm] = useState({ name: '', contact_info: '', address: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', contact_info: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    fetchShelters();
  }, [sortBy, sortOrder, searchTerm]);

  const fetchShelters = async () => {
    try {
      const res = await axios.get('http://localhost:5000/shelters', {
        params: {
          search: searchTerm,
          sortBy,
          order: sortOrder
        },
      });
      setShelters(res.data);
    } catch (err) {
      console.error('Error fetching shelters:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAddShelter = async () => {
    try {
      await axios.post('http://localhost:5000/shelters', form);
      setForm({ name: '', contact_info: '', address: '' });
      fetchShelters();
    } catch (err) {
      console.error('Error adding shelter:', err);
    }
  };

  const handleDeleteShelter = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/shelters/${id}`);
      fetchShelters();
    } catch (err) {
      console.error('Error deleting shelter:', err);
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
    try {
      await axios.patch(`http://localhost:5000/shelters/${editForm.id}`, editForm);
      setEditForm({ id: null, name: '', contact_info: '', address: '' });
      fetchShelters();
    } catch (err) {
      console.error('Error updating shelter:', err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shelters</h1>
      <p className="mb-4">Search</p>
      {/* Search and Sort */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search by name, contact or address"
          className="border p-2 flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
        <button onClick={handleClearSearch} className="bg-gray-400 text-white px-4 py-2 rounded">
          Clear
        </button>
      </div>

      {/* Add Shelter Form */}
      <p className="mb-4">Add Shelter</p>
      <div className="mb-6 space-y-2">
        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="contact_info"
          placeholder="Contact Info"
          className="border p-2 w-full"
          value={form.contact_info}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          className="border p-2 w-full"
          value={form.address}
          onChange={handleChange}
        />
        <button
          onClick={handleAddShelter}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Shelter
        </button>
      </div>

      {/* Sort Shelters */}
      <p className="mb-4">Sort Shelters</p>
      <div className="mb-4 flex gap-2">
        <label className="font-semibold">Sort by:</label>
        {['id', 'name', 'address', 'contact_info'].map((field) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`px-3 py-1 rounded border ${sortBy === field ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}
          >
            {field} {sortBy === field ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
          </button>
        ))}
      </div>

      {/* Shelter List */}
      <p className="mb-4">Shelters</p>
      <ul className="space-y-2">
        {shelters.map((shelter) => (
          <li key={shelter.id} className="flex justify-between items-center border p-2 rounded">
            <div>
              {editForm.id === shelter.id ? (
                <div>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="border p-2 w-full mb-2"
                  />
                  <input
                    name="contact_info"
                    value={editForm.contact_info}
                    onChange={handleEditChange}
                    className="border p-2 w-full mb-2"
                  />
                  <input
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="border p-2 w-full mb-2"
                  />
                  <button
                    onClick={handleUpdateShelter}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <strong>{shelter.name}</strong>
                  <br />
                  📞 {shelter.contact_info}
                  <br />
                  📍 {shelter.address}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDeleteShelter(shelter.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
              {editForm.id !== shelter.id && (
                <button
                  onClick={() => handleEditShelter(shelter)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Shelters;
