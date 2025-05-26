'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MoviesLibrary = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchMovies = async () => {
        try {
            const res = await fetch('/api/movies');
            if (!res.ok) throw new Error('Failed to load movies');
            setMovies(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/movies/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            setMovies(prev => prev.filter(movie => movie.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete movie. Please try again.');
        }
    };

    const handleAddMovie = () => {
        router.push('/movieForm');
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return null;

        if (path.startsWith('/http')) {
            return path.substring(1);
        }

        if (path.startsWith('http')) {
            return path;
        }

        return `https://image.tmdb.org/t/p/w500${path}`;
    };

    if (loading) return <div style={styles.loading}>Loading movies...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <div style={styles.headerContainer}>
                <h1 style={styles.header}>All Movies</h1>
                <button
                    style={styles.addButton}
                    onClick={handleAddMovie}
                >
                    Add Movie
                </button>
            </div>
            <div style={styles.moviesGrid}>
                {movies.map((movie) => {
                    const { id, original_title: title, poster_path } = movie;
                    const img = getImageUrl(poster_path);

                    return (
                        <div key={id} style={styles.movieCard}>
                            {img ? (
                                <img
                                    style={styles.movieImage}
                                    src={img}
                                    alt={title}
                                    onClick={() => router.push(`/movies/MovieDetails/${id}`)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-movie.png';
                                    }}
                                />
                            ) : (
                                <div style={styles.placeholderImage}>
                                    No Image Available
                                </div>
                            )}
                            <div style={styles.movieInfo}>
                                <span style={styles.movieId}>{id}</span>
                                <h2 style={styles.movieTitle}>{title}</h2>
                            </div>
                            <div style={styles.buttonContainer}>
                                <button
                                    style={styles.readButton}
                                    onClick={() => router.push(`/movies/MovieDetails/${id}`)}
                                >
                                    Read More
                                </button>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDelete(id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.5rem',
        margin: '2rem',
        color: '#4cc9f0'
    },
    error: {
        textAlign: 'center',
        fontSize: '1.5rem',
        margin: '2rem',
        color: '#ff6b6b'
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '20px 0 40px',
        flexWrap: 'wrap',
        gap: '20px'
    },
    header: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#333',
        margin: 0
    },
    addButton: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '25px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: '150px',
        ':hover': {
            backgroundColor: '#059669',
            transform: 'scale(1.05)'
        }
    },
    moviesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px',
        padding: '10px'
    },
    movieCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        color: '#ffffff',
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
        }
    },
    movieImage: {
        width: '100%',
        height: '400px',
        objectFit: 'cover',
        cursor: 'pointer',
        borderBottom: '2px solid #4cc9f0'
    },
    placeholderImage: {
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2d3748',
        color: '#a0aec0',
        borderBottom: '2px solid #4cc9f0',
        fontSize: '1.2rem'
    },
    movieInfo: {
        padding: '15px',
        textAlign: 'center'
    },
    movieId: {
        fontSize: '14px',
        color: '#a8dadc',
        display: 'block',
        marginBottom: '5px'
    },
    movieTitle: {
        fontSize: '18px',
        margin: '10px 0',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '0 15px 20px',
        gap: '15px'
    },
    readButton: {
        backgroundColor: '#4cc9f0',
        color: '#1a1a2e',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: '120px',
        ':hover': {
            backgroundColor: '#4895ef',
            transform: 'scale(1.05)'
        }
    },
    deleteButton: {
        backgroundColor: '#ff6b6b',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: '120px',
        ':hover': {
            backgroundColor: '#ff5252',
            transform: 'scale(1.05)'
        }
    }
};

export default MoviesLibrary;