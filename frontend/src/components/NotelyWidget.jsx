import React, { useEffect, useState } from "react";

const NotelyWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { if (isOpen) fetchNotes(); }, [isOpen]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes", { credentials: "include" });
      const data = await res.json();
      setNotes(data);
    } catch (e) {
      // Optionally show error
    }
  };

  const handleSave = async () => {
    if (!title && !content) return;
    try {
      let res, data;
      if (editingId) {
        res = await fetch(`/api/notes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, content })
        });
      } else {
        res = await fetch(`/api/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, content })
        });
      }
      data = await res.json();
      if (res.ok) {
        setTitle("");
        setContent("");
        setEditingId(null);
        fetchNotes();
      }
    } catch (e) {}
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        fetchNotes();
        if (editingId === id) {
          setTitle("");
          setContent("");
          setEditingId(null);
        }
      }
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="card notely-widget">
      <div className="card-heading is-flex is-justify-content-space-between is-align-items-center">
        <h4>Notely</h4>
        <button className="delete" aria-label="close" onClick={() => setIsOpen(false)}></button>
      </div>
      <div className="card-body">
        <input
          className="input mb-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="textarea mb-2"
          placeholder="Write your note..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
        />
        <div className="is-flex mb-3">
          <button className="button is-warning is-small mr-2" onClick={handleSave} style={{ flex: 1 }}>
            {editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button className="button is-light is-small" onClick={() => { setTitle(""); setContent(""); setEditingId(null); }}>Cancel</button>
          )}
        </div>
        <div className="notely-notes-list">
          {notes.length === 0 ? (
            <div className="has-text-grey is-size-7">No notes yet.</div>
          ) : (
            notes.map(note => (
              <div key={note._id} className="box notely-note mb-2">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <strong>{note.title}</strong>
                    <div className="is-size-7 has-text-grey">{note.content}</div>
                  </div>
                  <div>
                    <button className="button is-light is-small mr-1" onClick={() => handleEdit(note)} title="Edit"><i data-feather="edit-2"></i></button>
                    <button className="button is-danger is-small" onClick={() => handleDelete(note._id)} title="Delete"><i data-feather="trash-2"></i></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotelyWidget;