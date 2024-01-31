import {getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import firebase from './firebase';
import { UpdateRecipeDataType,updatePercentage,updateState, updateMsg} from "./Types";


export const Uploadfiles = async(
    selectedImage:File, 
    isUploadingImage:Boolean, 
    updateRecipeData:UpdateRecipeDataType, 
    updateState:updateState,
    updatePercentage:updatePercentage,
    updateMsg:updateMsg,
    ...additionalArgs: any[]) => {

    const [index, steps] = additionalArgs; // Destructuring if both are provided

    updateState(true);
    const storage = firebase.storage;
    const file = selectedImage;
    const storageRef = ref(storage, `stepImages/${file.name}}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
        'state_changed',
        (snapshot)=> {
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            updatePercentage(progress);
            if(progress == 100)
                updateMsg('Upload completed');

            console.log(`Upload is ${progress}% done`);
        },
        (error)=>{
            alert('Error uploading file');
            updateState(false);
        },
        async()=>{
            // complete
            
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            
            if (index !== undefined && steps !== undefined) {
                // Update steps array if index and steps are provided
                const updatedSteps = [...steps];
                updatedSteps[index].image = downloadURL;
                updateRecipeData('steps', updatedSteps);
            }
            else{
                if(isUploadingImage)
                    updateRecipeData('image', downloadURL);
                else
                    updateRecipeData('video', downloadURL);
            }
            updateState(false);
        }
        
    )
    
};