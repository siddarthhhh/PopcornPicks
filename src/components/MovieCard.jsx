import React from 'react';

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <div className='movie-card'>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : '/No-poster.png'
        }
        alt={title}
        className="w-full rounded"
      />

      <div className='mt-4 text-white'>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        <div className='content flex items-center gap-2 text-sm text-gray-300'>
          <div className='rating flex items-center gap-1'>
            <img src='Rating.svg' alt='rating icon' className="w-4 h-4" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span className="text-gray-500">•</span>

          <p className='lang'>{original_language?.toUpperCase()}</p>

          <span className="text-gray-500">•</span>

          <p className='year'>
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
