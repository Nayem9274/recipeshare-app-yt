import { useState, useRef } from 'react';
import { CustomButton } from '..';
import { getStorage } from "firebase/storage";
import app from "../firebase";
import { UploadTask, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import firebase from "../firebase";
type UpdateBlogDataType = (key: string, value: any) => void;


const BlogSteps:React.FC<{ updateBlogData: UpdateBlogDataType }> = ({updateBlogData}) =>{
  // Now you can access app and storage like this
  const storage = firebase.storage;
  const fileInputRef = useRef(null);
  

  type Step = {
    order: number;
    step: string;
    image: string | null; // Change from string | null to string
  };

  
  const [steps, setSteps] = useState<Step[]>([
    { order: 1, step: '', image: "" }, // Default step
  ]);


  const [selectedImage, setSelectedImage] = useState<File|null>(null);
  const [uploadTask, setUploadTask] = useState<UploadTask|null>(null);
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);


  const addStep = () => {
    setSteps([...steps, { order: steps.length + 1, step: '', image: null }]);
  };

  const handleChange = (index:number, field:string, value:string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => (i === index ? { ...step, [field]: value } : step)));
    updateBlogData('steps', steps);
  };

  const deleteStep = (index: number)=> {
      const updatedSteps = [...steps];
      updatedSteps.splice(index, 1);
      setSteps(updatedSteps);
      updateBlogData('steps', updatedSteps);
  };

  const handleImageUpload = async (index: number) => {
    const file = selectedImage;

  
    if (!file){
      alert('No file selected');
      return;
    } 

    setIsUploadingImage(true);

    const storageRef = ref(storage, `stepImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploadTask(uploadTask);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        console.log(snapshot);
      },
      (error) => {
        // Handle errors
        console.log(error);
      },
      async () => {
        // Complete
        alert('Image Upload is complete');
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);

        console.log(downloadURL);
        
        // update the steps array with the image url
        const updatedSteps = [...steps];
        updatedSteps[index].image = downloadURL;
        console.log(updatedSteps[index]);
        setSteps(updatedSteps);
        updateBlogData('steps', steps);
        console.log(steps);
        setIsUploadingImage(false);
      }
    );   
  };



  return (
    <div className="container mx-auto">
      <ol className="list-disc space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={step.order}
                onChange={(e) => handleChange(index, 'order', e.target.value)}
                className="w-20 h-10 border p-2 bg-gray-200 text-lg font-medium rounded"
                placeholder="Step #"
                min={index + 1}
                required
              />
              <textarea
                value={step.step}
                onChange={(e) => handleChange(index, 'step', e.target.value)}
                className="w-full h-30 border p-2 bg-gray-200 rounded resize text-center"
                placeholder="Step description"
                required
              />
              <CustomButton
                type="button"
                title="Delete"
                varient="btn_dark_red"
                otherStyles="bg-red-500 text-white px-2 py-1 rounded h-10"
                onClick={() => deleteStep(index)}
              />
            </div>

            {/* Image upload and preview in a separate row */}
            <div className="flex justify-center">
              {/* Add the image select option */}
              <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  placeholder='select image'
                  onChange={(event) => {
                    const file = event.target.files && event.target.files[0];
                    if (file) {
                      setSelectedImage(file);
                    }else{
                      console.log('error in file selection');
                    }
                  }}
              />

              <CustomButton
                  type="button"
                  title={isUploadingImage ? "Uploading...": "Upload Image"}
                  varient="btn_light_green"
                  otherStyles="bg-green-500 text-white px-4 py-1"
                  onClick={() => handleImageUpload(index)}
              />
            </div>
              
              {/* Add the image preview */}
              {step.image && (
                <div className="flex justify-center">
                  <img
                    src={step.image}
                    alt="Step Image"
                    className="w-24 h-24 object-cover"
                  />
                </div>
              )}

          </li>
        ))}
      </ol>
      <div className="flex justify-center mt-4">
        <CustomButton
          type="button"
          title="Add Step"
          varient="btn_light_green"
          otherStyles="bg-blue-500 text-white px-4 py-2 rounded-full"
          onClick={() => addStep()}
        />
      </div>
    </div>
  );
};

export default BlogSteps;