"use client";

import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

interface RecordingsListProps {
    isVisible: boolean;
}

const RecordingsList = ({ isVisible }: RecordingsListProps) => {
    const [videoFiles, setVideoFiles] = useState<string[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/api/videos');
                const data = await response.json();
                setVideoFiles(data.videoFiles);
            } catch (error) {
                console.error('Failed to fetch videos:', error);
            }
        };

        fetchVideos();
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div>
            <h3>Recordings</h3>
            <ul>
                {videoFiles.map(file => (
                    <li key={file} onClick={() => setSelectedVideo(`/records/${file}`)}>
                        {file}
                    </li>
                ))}
            </ul>
            {selectedVideo && <VideoPlayer src={selectedVideo} />}
        </div>
    );
};

export default RecordingsList;