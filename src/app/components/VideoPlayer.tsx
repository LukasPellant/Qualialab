"use client";

import React from 'react';

interface VideoPlayerProps {
    src: string;
}

const VideoPlayer = ({ src }: VideoPlayerProps) => {
    return (
        <video width="640" height="360" controls>
            <source src={src} type="video/mp4" />
            Tvůj prohlížeč nepodporuje video.
        </video>
    );
};

export default VideoPlayer;