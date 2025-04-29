import { useDispatch } from "react-redux";
import { apiClient } from "../apiClient";
import { addExp } from "../../store/userSlice";


export default async function addUserExp(userId: string, exp: number) {
    const dispatch = useDispatch();

    try {
        const response = await apiClient.post('/user/add-exp', {
            userId,
            exp,
        });
        dispatch(addExp(exp));
        return response.data;
    } catch (error) {
        console.error('Error adding user experience:', error);
        throw error;
    }
}