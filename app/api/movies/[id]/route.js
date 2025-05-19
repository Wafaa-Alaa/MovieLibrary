import movies from '@/data/data.json';
export async function GET(request, { params }) {
  try {
    const { id } = params; 
    const numericId = Number(id); 
    
    const data = movies.find(movie => movie.id === numericId);
    
    if (!data) {
      return new Response(JSON.stringify({ error: "Movie not found" }), {
        status: 404
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch movie" }), {
      status: 500
    });
  }
}

export function DELETE(request, { params }) {
  try {
    const { id } = params; 
    const numericId = Number(id); 

    const filteredMovies = movies.filter(movie => movie.id !== numericId);
    
    if (filteredMovies.length === movies.lNextength) {
      return new Response(JSON.stringify({ error: "Movie not found" }), {
        status: 404
      });
    }

    
    return new Response(JSON.stringify(filteredMovies), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete movie" }), {
      status: 500
    });
  }
}



