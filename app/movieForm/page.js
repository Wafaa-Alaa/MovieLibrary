'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MovieForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    original_title: '',
    overview: '',
    release_date: '',
    runtime: '',
    vote_average: '',
    vote_count: '',
    popularity: '',
    adult: false,
    poster_path: '',
    backdrop_path: '',
    genres: [{ name: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '2rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formWrapper: {
      maxWidth: '1000px',
      width: '100%',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1a1a2e',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1rem',
      color: '#666',
      maxWidth: '600px',
      margin: '0 auto'
    },
    formContainer: {
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e0e0e0'
    },
    errorContainer: {
      backgroundColor: '#fee2e2',
      borderLeft: '4px solid #ef4444',
      color: '#b91c1c',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '6px'
    },
    errorIcon: {
      flexShrink: '0',
      marginRight: '0.75rem',
      width: '20px',
      height: '20px',
      color: '#b91c1c'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.25rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#333',
      marginBottom: '0.5rem'
    },
    requiredField: {
      color: '#ef4444'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      color: '#333',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
      ':focus': {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
        outline: 'none'
      }
    },
    textarea: {
      minHeight: '120px',
      resize: 'vertical'
    },
    radioGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem'
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center'
    },
    radioInput: {
      marginRight: '0.5rem',
      accentColor: '#6366f1'
    },
    radioLabel: {
      color: '#555'
    },
    genreItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem'
    },
    genreInput: {
      flex: '1'
    },
    removeButton: {
      padding: '0.5rem',
      color: '#ef4444',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      lineHeight: '1',
      transition: 'opacity 0.2s ease'
    },
    addButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      backgroundColor: '#e0e7ff',
      color: '#4f46e5',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      marginTop: '0.5rem',
      ':hover': {
        backgroundColor: '#c7d2fe'
      }
    },
    submitButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4f46e5',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      ':hover': {
        backgroundColor: '#4338ca'
      }
    },
    submitButtonDisabled: {
      opacity: '0.7',
      cursor: 'not-allowed',
      backgroundColor: '#a5b4fc'
    },
    spinner: {
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem'
    },
    imagePreview: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      marginTop: '0.5rem',
      objectFit: 'cover'
    },
    previewContainer: {
      marginTop: '0.5rem'
    },
    fullWidth: {
      gridColumn: '1 / -1'
    },
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    }
  };

  const getTmdbImageUrl = (path, size = 'w500') => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/${size}${normalizedPath}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'adult' ? e.target.value === 'true' : value
    }));
  };

  const handleGenreChange = (index, value) => {
    setFormData(prev => {
      const newGenres = [...prev.genres];
      newGenres[index] = { name: value };
      return { ...prev, genres: newGenres };
    });
  };

  const addGenre = () => {
    setFormData(prev => ({
      ...prev,
      genres: [...prev.genres, { name: '' }]
    }));
  };

  const removeGenre = (index) => {
    if (formData.genres.length > 1) {
      setFormData(prev => ({
        ...prev,
        genres: prev.genres.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const movieData = {
        ...formData,
        poster_path: formData.poster_path.startsWith('/') ? formData.poster_path : `/${formData.poster_path}`,
        backdrop_path: formData.backdrop_path.startsWith('/') ? formData.backdrop_path : `/${formData.backdrop_path}`,
        runtime: Number(formData.runtime),
        vote_average: Number(formData.vote_average),
        vote_count: Number(formData.vote_count),
        popularity: Number(formData.popularity),
        genre_ids: formData.genres.map((_, index) => index + 1)
      };

      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create movie');
      }

      router.push('/movies');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Add New Movie</h1>
          <p style={styles.subtitle}>Fill in the details to add a new movie to the collection</p>
        </div>

        <div style={styles.formContainer}>
          {error && (
            <div style={styles.errorContainer}>
              <svg style={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {/* Left Column */}
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="title">
                  Title <span style={styles.requiredField}>*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="The Shawshank Redemption"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="original_title">
                  Original Title
                </label>
                <input
                  id="original_title"
                  name="original_title"
                  type="text"
                  value={formData.original_title}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Original title in native language"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="release_date">
                  Release Date
                </label>
                <input
                  id="release_date"
                  name="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="runtime">
                    Runtime (minutes)
                  </label>
                  <input
                    id="runtime"
                    name="runtime"
                    type="number"
                    min="0"
                    value={formData.runtime}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="popularity">
                    Popularity
                  </label>
                  <input
                    id="popularity"
                    name="popularity"
                    type="number"
                    step="0.1"
                    value={formData.popularity}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Adult Content</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioOption}>
                    <input
                      type="radio"
                      name="adult"
                      value="false"
                      checked={!formData.adult}
                      onChange={handleChange}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioLabel}>No</span>
                  </label>
                  <label style={styles.radioOption}>
                    <input
                      type="radio"
                      name="adult"
                      value="true"
                      checked={formData.adult}
                      onChange={handleChange}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioLabel}>Yes</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                <label style={styles.label} htmlFor="overview">
                  Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  rows={5}
                  value={formData.overview}
                  onChange={handleChange}
                  style={{ ...styles.input, ...styles.textarea }}
                  placeholder="A compelling movie description..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="vote_average">
                    Rating (0-10)
                  </label>
                  <input
                    id="vote_average"
                    name="vote_average"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.vote_average}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="vote_count">
                    Vote Count
                  </label>
                  <input
                    id="vote_count"
                    name="vote_count"
                    type="number"
                    min="0"
                    value={formData.vote_count}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="poster_path">
                  Poster Image Path
                </label>
                <input
                  id="poster_path"
                  name="poster_path"
                  type="text"
                  value={formData.poster_path}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg"
                />
                {formData.poster_path && (
                  <div style={styles.previewContainer}>
                    <img
                      src={getTmdbImageUrl(formData.poster_path)}
                      alt="Poster preview"
                      style={styles.imagePreview}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="backdrop_path">
                  Backdrop Image Path
                </label>
                <input
                  id="backdrop_path"
                  name="backdrop_path"
                  type="text"
                  value={formData.backdrop_path}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="/2Nti3gYAX513wvhp8IiLL6ZDyOm.jpg"
                />
                {formData.backdrop_path && (
                  <div style={styles.previewContainer}>
                    <img
                      src={getTmdbImageUrl(formData.backdrop_path, 'original')}
                      alt="Backdrop preview"
                      style={styles.imagePreview}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Genres</label>
                {formData.genres.map((genre, index) => (
                  <div key={index} style={styles.genreItem}>
                    <input
                      type="text"
                      value={genre.name}
                      onChange={(e) => handleGenreChange(index, e.target.value)}
                      style={{ ...styles.input, ...styles.genreInput }}
                      placeholder="Action, Drama, etc."
                    />
                    <button
                      type="button"
                      onClick={() => removeGenre(index)}
                      disabled={formData.genres.length <= 1}
                      style={{
                        ...styles.removeButton,
                        ...(formData.genres.length > 1 ? { opacity: 1 } : {})
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGenre}
                  style={styles.addButton}
                >
                  + Add Genre
                </button>
              </div>
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth, textAlign: 'right' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {})
                }}
              >
                {loading ? (
                  <>
                    <svg style={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2v4m0 12v4m6-10h4M2 12h4m13.657-5.657l-2.828 2.828m-9.9 9.9l-2.828 2.828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Movie'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;