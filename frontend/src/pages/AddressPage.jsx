import { useState, useEffect } from 'react';
import { MapPin, User, Phone, Home, Plus, Edit3, Trash2, X, Save, Mail } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function AddressPage() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    house_ward: '',
    district_province: '',
    phone_number: '',
    postal_code: '',
  });

  const fetchAddresses = () => {
    axios
      .get('http://localhost:8000/api/v1/addresses', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
      })
      .then((res) => setAddresses(res.data.addresses))
      .catch((err) => console.error('Error fetching addresses', err));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setForm({
      full_name: '',
      house_ward: '',
      district_province: '',
      phone_number: '',
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    const url = editingId
      ? `http://localhost:8000/api/v1/addresses/${editingId}`
      : 'http://localhost:8000/api/v1/addresses';

    const method = editingId ? axios.put : axios.post;

    method(url, form, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
    })
      .then(() => {
        resetForm();
        setShowAddressForm(false);
        fetchAddresses();
      })
      .catch(() => alert('Failed to save address.'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this address?')) return;

    axios
      .delete(`http://localhost:8000/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        alert('Deleted successfully!');
        fetchAddresses();
      })
      .catch(() => alert('Failed to delete address.'));
  };

  const openAddForm = () => {
    resetForm();
    setShowAddressForm(true);
  };

  const openEditForm = (address) => {
    setForm({
      full_name: address.full_name,
      house_ward: address.house_ward,
      district_province: address.district_province,
      phone_number: address.phone_number,
    });
    setEditingId(address.id);
    setShowAddressForm(true);
  };

  const fields = [
    { label: 'Full Name', key: 'full_name' },
    { label: 'House# & Ward', key: 'house_ward' },
    { label: 'District and Province', key: 'district_province' },
    { label: 'Phone Number', key: 'phone_number' },
    { label: 'Postal Code', key: 'postal_code' },
  ];

  return (
    <main className='flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 font-sans'>
      <div className='flex-1 flex flex-col max-w-6xl mx-auto p-6 h-full'>
        <section className='flex-1 h-full bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden flex flex-col'>
          <header className='bg-gradient-to-r from-[#183B4E] to-[#DDA853] px-8 py-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                  <MapPin size={24} className='text-white' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white'>
                    Address Management
                  </h1>
                  <p className='text-white/80 mt-1'>
                    Manage your delivery addresses
                  </p>
                </div>
              </div>
              <button
                onClick={openAddForm}
                className='flex items-center gap-2 px-6 py-3 bg-white text-[#183B4E] rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold hover:-translate-y-1'
              >
                <Plus size={18} />
                Add New Address
              </button>
            </div>
          </header>

          <div className='flex-1 p-8 h-full'>
            {addresses.length === 0 ? (
              <div className='text-center py-12'>
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <MapPin size={32} className='text-gray-400' />
                </div>
                <p className='text-gray-500 text-lg'>No addresses added yet</p>
                <p className='text-gray-400 text-sm mt-2'>Add your first delivery address to get started</p>
              </div>
            ) : (
              <div className='grid gap-6'>
                {addresses.map((addr) => (
                  <article
                    key={addr.id}
                    className='bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#183B4E]/20 transition-all duration-300 hover:-translate-y-1'
                  >
                    <div className='flex justify-between items-start gap-6'>
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-center gap-2'>
                          <User size={16} className='text-[#183B4E]' />
                          <span className='font-semibold text-gray-900'>{addr.full_name}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Home size={16} className='text-[#183B4E]' />
                          <span className='text-gray-700'>{addr.house_ward}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <MapPin size={16} className='text-[#183B4E]' />
                          <span className='text-gray-700'>{addr.district_province}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Mail size={16} className='text-[#183B4E]' />
                          <span className='text-gray-700'>{addr.postal_code}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Phone size={16} className='text-[#183B4E]' />
                          <span className='text-gray-700'>{addr.phone_number}</span>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => openEditForm(addr)}
                          className='flex items-center gap-2 px-4 py-2 bg-[#DDA853] text-white rounded-xl hover:bg-[#DDA853]/90 transition-all duration-300 font-medium'
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 font-medium'
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Modal */}
            {showAddressForm && (
              <div className='fixed inset-0 flex z-50 bg-black/30 backdrop-blur-sm justify-center items-center p-4 min-h-screen'>
                <div className='w-full max-w-md bg-white rounded-2xl overflow-hidden max-h-[90vh] flex flex-col'>
                  <header className='bg-gradient-to-r from-[#183B4E] to-[#DDA853] px-6 py-4'>
                    <div className='flex justify-between items-center'>
                      <h2 className='text-xl font-bold text-white'>
                        {editingId ? 'Edit Address' : 'New Address'}
                      </h2>
                      <button
                        onClick={() => {
                          resetForm();
                          setShowAddressForm(false);
                        }}
                        className='w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300'
                      >
                        <X size={18} className='text-white' />
                      </button>
                    </div>
                  </header>
                  <div className='p-6 space-y-6 overflow-y-auto'>
                    {fields.map(({ label, key }) => {
                      const getIcon = () => {
                        switch (key) {
                          case 'full_name': return <User size={18} className='text-[#183B4E]' />;
                          case 'house_ward': return <Home size={18} className='text-[#183B4E]' />;
                          case 'district_province': return <MapPin size={18} className='text-[#183B4E]' />;
                          case 'phone_number': return <Phone size={18} className='text-[#183B4E]' />;
                          case 'postal_code': return <Mail size={18} className='text-[#183B4E]' />;
                          default: return null;
                        }
                      };
                      
                      return (
                        <div key={key} className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            {getIcon()}
                            <label className='text-sm font-semibold text-gray-900'>
                              {label}
                            </label>
                          </div>
                          <input
                            type='text'
                            placeholder={`Enter ${label.toLowerCase()}`}
                            value={form[key]}
                            onChange={(e) =>
                              setForm({ ...form, [key]: e.target.value })
                            }
                            className='w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none transition-all duration-200'
                          />
                        </div>
                      );
                    })}
                    <div className='flex gap-3 pt-4'>
                      <button
                        onClick={() => {
                          resetForm();
                          setShowAddressForm(false);
                        }}
                        className='flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#183B4E] text-white rounded-xl hover:bg-[#183B4E]/90 transition-all duration-300 font-semibold'
                      >
                        <Save size={18} />
                        {editingId ? 'Update' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AddressPage;
