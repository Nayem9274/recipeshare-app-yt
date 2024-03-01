'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { RatingsupDataType, CommentsupDataType } from "@/Types";

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
    steps: {
        // Assuming image is an array of strings based on your JSON structure
        order: number;
        step: string;
        image: string;
    }[];
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
        user: string;
    }[];
}

const Blog: React.FC<{ ratingsUpData: RatingsupDataType, commentsUpData: CommentsupDataType }> = ({ ratingsUpData, commentsUpData }) => {

    const [blogData, setBlogData] = useState<ApiBlogResponse | null>(null);
    const { id: blogId } = useParams(); // Destructure the id property
    console.log(blogId); // Output: '12'
    //const router = useRouter();
    //const { blogId } = router.query;
    const [cookie, setCookie] = React.useState<string | undefined>('');
    const [blog_id, setId] = useState<string>('');
    const [ratings, setRatings] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [ratingsData, setRatingsData] = React.useState<Record<string, any>>({
        blog_id: "",
        jwt: "",
        ratings: "",
    });
    const [commentsData, setCommentsData] = React.useState<Record<string, any>>({
        blog_id: "",
        jwt: "",
        text: "",
        user: ""
    });


    const CommentsupData: CommentsupDataType = (key: string, value: any) => {

        setCommentsData(prevState => ({
            ...prevState,
            [key]: value
        }));
        // console.log(recipeData);
    };
    const RatingsupData: RatingsupDataType = (key: string, value: any) => {


        setRatingsData(prevState => ({
            ...prevState,
            [key]: value
        }));
        // console.log(recipeData);
    };

    const getCookie = () => {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('jwt='))?.split('=')[1];
        console.log(cookieValue);

        RatingsupData('jwt', cookieValue);
        CommentsupData('jwt', cookieValue);
        console.log(ratingsData);
        setCookie(cookieValue);
    };


    useEffect(() => {
        getCookie();


        const fetchData = async () => {




            /************Add the cookie to the body ************** */
            // RatingsupData('jwt', cookie);
            RatingsupData('blog_id', blogId);
            CommentsupData('blog_id', blogId);


            console.log(blogId);
            try {
                const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/get/', {
                    method: 'POST',
                    headers: {
                        //Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcjEzNzM3NUBnbWFpbC5jb20iLCJleHAiOjE3MDYzMjY4MTMsImlhdCI6MTcwNjMyMzIxM30.xLX9HeailgdxCvDqcRsUGvctctH6rDnWpPpiDmTLbUs',
                    },
                    body: JSON.stringify({ 'blog_id': blogId?.toString() || '' }),
                });
                const data: ApiBlogResponse = await response.json();
                console.log(data);
                setBlogData(data);
            } catch (error) {
                console.error('Error fetching blog data:', error);
            }
        };

        fetchData();
    }, []); // The dependency array now includes 'cookie'

    const addRating = async (event: React.FormEvent<HTMLFormElement>) => {

        if (!cookie) {
            alert('Cookie not found. Please log in again.');
            return;
        }



        event.preventDefault(); // Moved the event.preventDefault() call to the beginning
        console.log(ratingsData);

        try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/addrating/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingsData),
            });
            const data = await response.json();
            console.log(data);
            // Update the blog data with the new average rating

        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };

    // Function to handle adding a new comment
    const handleAddComment = async () => {


        if (!cookie) {
            alert('Cookie not found. Please log in again.');
            return;
        }
        console.log(commentsData);
        try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/comment/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentsData),
            });
            const data = await response.json();
            console.log(data);

            // Update the blog data with the new comment

        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!blogData) {
        return <div>Loading...</div>; // You might want to add a loading state
    }


    // Function to transform numerical ratings to stars
    // StarRating component

    const StarRating = ({ rating }: { rating: number }) => {
        const fullStars = Math.floor(rating);
        const remainder = rating - fullStars;

        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg
                    key={i}
                    className="h-5 w-5 fill-current text-yellow-500"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 1l2.74 5.89 6.43.94-4.67 4.58 1.11 6.41-5.61-3.13-5.61 3.13 1.11-6.41L.83 7.83l6.43-.94L10 1z" />
                </svg>
            );
        }

        if (remainder >= 0.25) {
            stars.push(
                <svg
                    key="partial"
                    className="h-5 w-5 fill-current text-yellow-500"
                    viewBox="0 0 20 20"
                >
                    {/* Clip path to define the filled portion based on remainder */}
                    <clipPath id="clip-path">
                        <rect x="0" y="0" width={Math.floor(remainder * 100) + "%"} height="100%" fill="lightgray" />
                    </clipPath>
                    <path
                        d="M10 1l2.74 5.89 6.43.94-4.67 4.58 1.11 6.41-5.61-3.13-5.61 3.13 1.11-6.41L.83 7.83l6.43-.94L10 1z"
                        clipRule="evenodd"
                        clipPath="url(#clip-path)"
                    />
                </svg>
            );
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
                <p>Last modified on {new Date(blogData.last_modification_date).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 flex space-x-4">
                {/* Tags Box */}
                <div className="flex-1">
                    <p className="text-lg text-indigo-500 font-bold mb-2">Tags:</p>
                    <p className="text-lg text-red-500">{blogData.tags.join(', ')}</p>
                </div>
                {/* Ratings Box */}
                <div className="flex-1">
                    <div className="flex items-center">
                        <p className="text-lg text-indigo-500 font-bold mb-1 mx-3.5">Rating:</p>
                        <StarRating rating={blogData.ratings} />
                        <span className="ml-2">
                            {Math.round(blogData.ratings * 4) / 4} {/* Round to the nearest 0.25 */}
                        </span>
                    </div>
                    {/* Add a form to submit a rating */}
                    <form onSubmit={addRating} className="flex-1 flex items-center">

                        <input
                            type="text"
                            id="ratings"
                            value={ratings}
                            onChange={(e) => { setRatings(e.target.value); RatingsupData("ratings", e.target.value); }}
                            className="w-full border rounded-md px-3 py-2 mt-1"
                            style={{ padding: '10px' }}
                            placeholder="Enter rating(1-5)..."
                        />
                        <button type="submit"><p className="text-lg text-green-700 font-bold mb-2">Submit</p></button>
                    </form>
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
                            <p className="text-gray-500">By User {comment.user} on {new Date(comment.date).toLocaleDateString()}</p>
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
                    value={text}
                    onChange={(e) => { setText(e.target.value); CommentsupData("text", e.target.value); }}
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
