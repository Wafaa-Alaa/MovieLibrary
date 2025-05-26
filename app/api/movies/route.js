import movies from '@/data/data.json';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    return new Response(JSON.stringify(movies), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch movies" }), {
      status: 500
    });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();


    const newId = Math.max(...movies.map(movie => movie.id)) + 1;


    const newMovie = {
      id: newId,
      adult: data.adult || false,
      backdrop_path: data.backdrop_path || '',
      genre_ids: data.genres.map((_, index) => index + 1),
      original_language: 'en',
      original_title: data.original_title || data.title,
      overview: data.overview || '',
      popularity: data.popularity ? Number(data.popularity) : 0,
      poster_path: data.poster_path || '',
      release_date: data.release_date || '',
      title: data.title,
      video: false,
      vote_average: data.vote_average ? Number(data.vote_average) : 0,
      vote_count: data.vote_count ? Number(data.vote_count) : 0
    };


    const updatedMovies = [...movies, newMovie];


    const filePath = path.join(process.cwd(), 'data', 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(updatedMovies, null, 2));

    return new Response(JSON.stringify(newMovie), {
      headers: { 'Content-Type': 'application/json' },
      status: 201
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create movie" }), {
      status: 500
    });
  }
}