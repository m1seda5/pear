import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';
import { useShowToast } from '../contexts/ShowToastContext';

const UserSearch = ({ onUserSelect, selectedUsers = [], excludeIds = [], placeholder, isReviewerOnly = false }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const showToast = useShowToast();

  const debouncedSearch = useRef(
    debounce(async (term) => {
      if (term.length < 2) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const endpoint = isReviewerOnly 
          ? `/api/users/search-reviewers/${encodeURIComponent(term)}`
          : `/api/users/search/${encodeURIComponent(term)}`;
        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setUsers([]);
          return;
        }
        const filtered = Array.isArray(data) 
          ? data.filter(user => 
              user._id !== currentUser._id &&
              !selectedUsers.some(selected => selected._id === user._id) &&
              !excludeIds.includes(user._id)
            )
          : data._id !== currentUser._id && 
            !selectedUsers.some(selected => selected._id === data._id) &&
            !excludeIds.includes(data._id)
            ? [data] 
            : [];
        setUsers(filtered);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 500)
  ).current;

  useEffect(() => { return () => { debouncedSearch.cancel(); }; }, [debouncedSearch]);

  useEffect(() => {
    const searchUsers = async () => {
      if (search.trim() === "") {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${search}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [search, showToast]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      debouncedSearch(value.trim());
    } else {
      debouncedSearch.cancel();
      setUsers([]);
    }
  };

  const handleSelectUser = (user) => {
    onUserSelect(user);
    setSearch("");
    setUsers([]);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setUsers([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const clearSearch = () => {
    setSearch("");
    setUsers([]);
    inputRef.current?.focus();
  };

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        className="input"
        type="text"
        placeholder={placeholder || t('Search for users...')}
        value={search}
        onChange={handleSearchChange}
      />
      {loading && <div className="loading">Loading...</div>}
      {users.length > 0 && (
        <div className="search-results">
          {users.map((user) => (
            <div key={user._id} className="user-result">
              <img src={user.profilePic || "/default-avatar.png"} alt={user.username} className="avatar" />
              <span className="username">{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;