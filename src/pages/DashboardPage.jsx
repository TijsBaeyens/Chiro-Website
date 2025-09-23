import React, { useState, useEffect, useRef } from 'react';
import '../css/DashboardPage.css';

const TABS = [
  { key: 'artikels', label: 'Artikels' },
  { key: 'evenementen', label: 'Evenementen' },
  { key: 'albums', label: 'Foto Albums' },
  { key: 'personen', label: 'Personen' },
];

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('artikels');

  return (
    <div className="dashboard-container">
      <nav className="dashboard-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="dashboard-content">
        {activeTab === 'artikels' && <ArtikelsDashboard />}
        {activeTab === 'evenementen' && <EvenementenDashboard />}
        {activeTab === 'albums' && <AlbumsDashboard />}
        {activeTab === 'personen' && <PersonenDashboard />}
      </div>
    </div>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ArtikelsDashboard() {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editArtikel, setEditArtikel] = useState(null);

  // Ophalen van artikels
  useEffect(() => {
    fetch('http://localhost:3307/artikels')
      .then(res => res.json())
      .then(data => setArtikels(data))
      .finally(() => setLoading(false));
  }, []);

  // Favoriet togglen
  const toggleFavoriet = async (artikel) => {
    const updated = { ...artikel, favoriet: !artikel.favoriet };
    await fetch(`http://localhost:3307/artikels/${artikel.artikelID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    setArtikels(artikels.map(a => a.artikelID === artikel.artikelID ? updated : a));
  };

  // Verwijderen
  const deleteArtikel = async (id) => {
    await fetch(`http://localhost:3307/artikels/${id}`, { method: 'DELETE' });
    setArtikels(artikels.filter(a => a.artikelID !== id));
  };

  // Bewerken
  const handleEdit = (artikel) => {
    setEditArtikel(artikel);
    setShowModal(true);
  };

  // Toevoegen
  const handleAdd = () => {
    setEditArtikel(null);
    setShowModal(true);
  };

  // Opslaan (toevoegen of bewerken)
  const handleSave = async (artikel) => {
    if (artikel.artikelID) {
      // Update
      await fetch(`http://localhost:3307/artikels/${artikel.artikelID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artikel)
      });
      setArtikels(artikels.map(a => a.artikelID === artikel.artikelID ? artikel : a));
    } else {
      // Nieuw
      const res = await fetch('http://localhost:3307/artikels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artikel)
      });
      const nieuw = await res.json();
      setArtikels([...artikels, nieuw]);
    }
    setShowModal(false);
  };

  return (
    <div className="dashboard-artikels-grid">
      {loading ? <div>Laden...</div> : (
        <>
          {artikels.map(artikel => (
            <div className="dashboard-artikel-card" key={artikel.artikelID}>
              <div className="dashboard-artikel-header">
                <span className="dashboard-artikel-title">{artikel.titel}</span>
                <button className="star-btn" onClick={() => toggleFavoriet(artikel)} title="Favoriet">
                  {artikel.favoriet ? '★' : '☆'}
                </button>
              </div>
              <div className="dashboard-artikel-date">{artikel.datum}</div>
              {artikel.locatieFoto && (
                <img className="dashboard-artikel-img" src={artikel.locatieFoto} alt={artikel.titel} />
              )}
              <div className="dashboard-artikel-text">{artikel.tekst}</div>
              <div className="dashboard-artikel-actions">
                <button className="edit-btn" onClick={() => handleEdit(artikel)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteArtikel(artikel.artikelID)}>🗑️</button>
              </div>
            </div>
          ))}
          {/* Add new artikel card */}
          <div className="dashboard-artikel-card dashboard-artikel-add" onClick={handleAdd} title="Artikel toevoegen">
            <span className="add-plus">+</span>
          </div>
        </>
      )}
      {showModal && (
        <ArtikelModal
          artikel={editArtikel}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ArtikelModal({ artikel, onClose, onSave }) {
  const [titel, setTitel] = useState(artikel?.titel || '');
  const [datum, setDatum] = useState(artikel?.datum || '');
  const [tekst, setTekst] = useState(artikel?.tekst || '');
  const [locatieFoto, setLocatieFoto] = useState(artikel?.locatieFoto || '');
  const [bijschrift, setBijschrift] = useState(artikel?.bijschrift || '');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Upload image and get URL
  const uploadImage = async () => {
    if (!file) return locatieFoto;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('http://localhost:3307/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setUploading(false);
        return `http://localhost:3307${data.imageUrl}`;
      } else {
        const errorData = await res.json();
        setUploading(false);
        alert(`Uploaden van afbeelding mislukt: ${errorData.error}`);
        return locatieFoto;
      }
    } catch (error) {
      setUploading(false);
      alert('Uploaden van afbeelding mislukt!');
      return locatieFoto;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fotoUrl = locatieFoto;
    if (file) {
      fotoUrl = await uploadImage();
    }
    onSave({
      ...artikel,
      titel,
      datum,
      tekst,
      locatieFoto: fotoUrl,
      bijschrift,
      favoriet: artikel?.favoriet || false
    });
  };

  return (
    <div className="dashboard-modal-bg" onClick={onClose}>
      <form className="dashboard-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{artikel ? 'Artikel bewerken' : 'Artikel toevoegen'}</h2>
        <label>Titel<input value={titel} onChange={e => setTitel(e.target.value)} required /></label>
        <label>Datum<input value={datum} onChange={e => setDatum(e.target.value)} required type="date" /></label>
        <label>Tekst<textarea value={tekst} onChange={e => setTekst(e.target.value)} required /></label>
        <label>Afbeelding
          <div
            className="dashboard-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: 'pointer', border: '2px dashed #FFD6D6', borderRadius: 10, padding: '1rem', textAlign: 'center', background: '#ffeaea', marginBottom: '0.5rem' }}
          >
            {file ? file.name : (locatieFoto ? <img src={locatieFoto} alt="Voorbeeld" style={{ maxWidth: 120, maxHeight: 80 }} /> : 'Sleep een afbeelding hierheen of klik om te kiezen')}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </label>
        <label>Bijschrift<input value={bijschrift} onChange={e => setBijschrift(e.target.value)} /></label>
        <div className="dashboard-modal-actions">
          <button type="submit" disabled={uploading}>{uploading ? 'Uploaden...' : 'Opslaan'}</button>
          <button type="button" onClick={onClose}>Annuleren</button>
        </div>
      </form>
    </div>
  );
}

function EvenementenDashboard() {
  return <div>Evenementen beheer (lijst, toevoegen, bewerken, verwijderen, favoriet)</div>;
}
function AlbumsDashboard() {
  return <div>Foto Albums beheer (lijst, toevoegen, bewerken, verwijderen, favoriet)</div>;
}
function PersonenDashboard() {
  return <div>Personen beheer (lijst, toevoegen, bewerken, verwijderen, favoriet)</div>;
}

export default DashboardPage; 