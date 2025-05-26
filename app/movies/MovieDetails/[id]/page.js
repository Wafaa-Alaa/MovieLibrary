'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const MovDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`/api/movies/${id}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setMovie(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const getImageUrl = (path, size = 'w500') => {
        if (!path) return null;
        if (path.startsWith('/http')) return path.substring(1);
        if (path.startsWith('http')) return path;
        return `https://image.tmdb.org/t/p/${size}${path}`;
    };

    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;
    if (!movie) return <div style={styles.error}>Movie not found</div>;

    const imgUrl = getImageUrl(movie.poster_path) || 
                  'https://via.placeholder.com/500x750?text=Poster+Not+Available';
        
    const backdropUrl = getImageUrl(movie.backdrop_path, 'original') || 
                      'https://via.placeholder.com/1920x1080?text=Backdrop+Not+Available';

    
    const responsiveStyles = {
        cardContainer: {
            ...styles.cardContainer,
            flexDirection: isMobile ? 'column' : 'row'
        },
        imageContainer: {
            ...styles.imageContainer,
            flex: isMobile ? '0 0 auto' : '0 0 350px',
            width: isMobile ? '100%' : undefined
        },
        img: {
            ...styles.img,
            maxWidth: isMobile ? '250px' : '350px'
        },
        title: {
            ...styles.title,
            fontSize: isMobile ? '1.8rem' : '2.5rem'
        },
        subtitle: {
            ...styles.subtitle,
            fontSize: isMobile ? '1.2rem' : '1.5rem'
        },
        text: {
            ...styles.text,
            fontSize: isMobile ? '1rem' : '1.1rem'
        },
        metaData: {
            ...styles.metaData,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '10px' : '20px'
        },
        detailsGrid: {
            ...styles.detailsGrid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(200px, 1fr))'
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={{ ...styles.backdrop, backgroundImage: `url(${backdropUrl})` }}></div>
            <div style={responsiveStyles.cardContainer}>
                <div style={responsiveStyles.imageContainer}>
                    <img 
                        style={responsiveStyles.img} 
                        src={imgUrl} 
                        alt={movie.title}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Not+Available';
                        }}
                    />
                </div>
                <div style={styles.detailsContainer}>
                    <h1 style={responsiveStyles.title}>{movie.title} ({movie.release_date?.substring(0, 4)})</h1>
                    <div style={responsiveStyles.metaData}>
                        <span style={styles.rating}>⭐ {movie.vote_average}/10 ({movie.vote_count} votes)</span>
                        <span style={styles.popularity}>Popularity: {movie.popularity?.toFixed(1)}</span>
                    </div>
                    
                    <h3 style={responsiveStyles.subtitle}>Original Title</h3>
                    <p style={responsiveStyles.text}>{movie.original_title} ({movie.original_language?.toUpperCase()})</p>
                    
                    <h3 style={responsiveStyles.subtitle}>Overview</h3>
                    <p style={responsiveStyles.text}>{movie.overview}</p>
                    
                    <h3 style={responsiveStyles.subtitle}>Details</h3>
                    <div style={responsiveStyles.detailsGrid}>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Release Date:</span>
                            <span>{movie.release_date}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Adult Content:</span>
                            <span>{movie.adult ? 'Yes' : 'No'}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Runtime:</span>
                            <span>{movie.runtime} minutes</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Genres:</span>
                            <span>
                                {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const styles = {
    pageContainer: {
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.2,
        zIndex: 0
    },
    cardContainer: {
        position: 'relative',
        display: 'flex',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        zIndex: 1
    },
    imageContainer: {
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#f0f0f0'
    },
    img: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)'
    },
    detailsContainer: {
        flex: '1',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    title: {
        marginBottom: '10px',
        color: '#333',
        fontWeight: '700'
    },
    subtitle: {
        margin: '20px 0 10px',
        color: '#444',
        fontWeight: '600'
    },
    text: {
        lineHeight: '1.6',
        color: '#555',
        margin: '0 0 15px'
    },
    metaData: {
        display: 'flex',
        marginBottom: '20px'
    },
    rating: {
        color: '#e67e22',
        fontWeight: '600'
    },
    popularity: {
        color: '#666',
        backgroundColor: '#f0f0f0',
        padding: '5px 10px',
        borderRadius: '4px'
    },
    detailsGrid: {
        display: 'grid',
        gap: '15px',
        marginTop: '10px'
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column'
    },
    detailLabel: {
        fontSize: '0.9rem',
        color: '#777',
        marginBottom: '5px'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '1.5rem'
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '1.5rem',
        color: 'red'
    }
};

export default MovDetails;