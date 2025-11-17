import { db } from '../firebase/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';

export const deleteProfile = async (profileId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'profiles', profileId));
    console.log('Profile deleted successfully');
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw new Error('Profile deletion failed');
  }
};

