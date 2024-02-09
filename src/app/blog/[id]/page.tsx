'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';


interface ApiBlogResponse {
    id: number;
    title: string;
    summary: string;
    content?: string;  // Assuming content is optional based on your JSON structure
    image: string;      // Optional image field
    publication_date: string;
    last_modification_date: string;
    tags: string[];
    ratings: number;
    user: {
        name: string;
        // Add other user-related fields based on your User model
    };
    sections: {
        id: number;
        title: string;
        content: string;
        image: string[];  // Assuming image is an array of strings based on your JSON structure
        order: number;
    }[];
    comments: {
        id: number;
        text: string;
        date: string;
        user: number;  // Assuming user is a user ID
    }[];
}

const Blog = () => {

    const [blogData, setBlogData] = useState<ApiBlogResponse | null>(null);
    const { id: blogId } = useParams(); // Destructure the id property
    console.log(blogId); // Output: '12'
   //const router = useRouter();
   //const { blogId } = router.query;
    
  
    useEffect(() => {
        
        const fetchData = async () => {
            
            console.log(blogId);
            try {
                const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/get/', {
                    method:'POST',
                    headers: {
                        //Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcjEzNzM3NUBnbWFpbC5jb20iLCJleHAiOjE3MDYzMjY4MTMsImlhdCI6MTcwNjMyMzIxM30.xLX9HeailgdxCvDqcRsUGvctctH6rDnWpPpiDmTLbUs',
                    },
                    body: JSON.stringify({'blog_id': blogId?.toString()||'' }),
                });
                const data: ApiBlogResponse = await response.json();
                console.log(data);
                setBlogData(data);
            } catch (error) {
                console.error('Error fetching blog data:', error);
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures that the effect runs once when the component mounts



    if (!blogData) {
        return <div>Loading...</div>; // You might want to add a loading state
    }
    // State for managing the new comment
    // const [newComment, setNewComment] = useState('');//////must add
    const newComment = '';


    // Function to handle adding a new comment
    const handleAddComment = () => {
        // Implement your logic for adding a new comment here
        console.log('Adding comment:', newComment);
        // Clear the comment input
        //setNewComment('');//////must add
    };

    // Function to transform numerical ratings to stars
    // StarRating component
    const StarRating = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i}>★</span>);
        }

        // Add half star if applicable
        if (hasHalfStar) {
            stars.push(<span key="half">½</span>);
        }

        return <div className="flex">{stars}</div>;
    };

    return (
        <div className="p-4 lg:px-20 xl:px-40">
            {/* IMAGE AND TITLE */}
            {blogData.image && (
                <div className="relative w-full h-1/3 md:h-1/2 lg:w-1/2">
                    <Image
                        src={blogData.image}
                        alt=""
                        className="object-cover"
                        layout="responsive"
                        height="200"
                        width="200"
                    />
                </div>
            )}
            <h1 className="text-3xl font-bold uppercase xl:text-5xl mt-4">{blogData.title}</h1>

            {/* USER INFO */}
            <div className="text-gray-500">
                <p>By {blogData.user.name}</p>
                <p>Published on {blogData.publication_date}</p>
            </div>
            <div className="mt-4 flex space-x-4">
                {/* Tags Box */}
                <div className="flex-1">
                    <p className="text-lg text-indigo-500 font-bold mb-2">Tags:</p>
                    <p className="text-lg text-red-500">{blogData.tags.join(', ')}</p>
                </div>
                {/* Ratings Box */}
                <div className="flex-1">
                    <p className="text-lg text-indigo-500 font-bold mb-2">Rating:</p>
                    <p className="text-lg text-yellow-500">{blogData.ratings}</p>
                </div>
            </div>
            {/* SUMMARY */}
            <div className="mt-8 bg-gray-100 p-4 rounded-md">
                <h2 className="text-2xl font-bold mb-2">Summary</h2>
                <p className="font-serif text-lg italic">{blogData.summary}</p>
            </div>

            {/* SECTIONS */}
            <div className="mt-8">
                {blogData.sections.map((section) => (
                    <div key={section.id} className="mb-6">
                        <h2 className="text-3xl font-bold text-blue-500 mb-2">{section.title}</h2>

                        {section.image && section.image.length > 0 && (
                            <div style={{ position: 'relative', width: '40%', height: '150px' }}>
                                <Image
                                    src={section.image[0]}  // Assuming section.image is the image URL
                                    alt={`Image for ${section.title}`}
                                    layout="fill"

                                />
                            </div>
                        )}
                        <p className="text-lg">{section.content}</p>
                    </div>
                ))}
            </div>

            {/* COMMENTS */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                <ul>
                    {blogData.comments.map((comment) => (
                        <li key={comment.id} className="mb-2">
                            <p>{comment.text}</p>
                            <p className="text-gray-500">By User {comment.user} on {comment.date}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ADD COMMENT FORM */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Add a Comment</h2>
                <textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Type your comment here..."
                    value={newComment}
                //onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleAddComment}
                >
                    Add Comment
                </button>
            </div>
        </div>
    );
};

export default Blog;
