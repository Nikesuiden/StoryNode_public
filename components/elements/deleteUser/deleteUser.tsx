import { createClient } from "@/utils/supabase/client";
import { Box, Button } from "@mui/material";
import { User } from "@supabase/supabase-js";

interface UserProps{
    UserProp: string;
}

const DeleteUser = ({ UserProp }: UserProps) => { // Props をオブジェクトから展開
    const handleDeleteUser = async () => {
      const supabase = await createClient();
      try {
        const { data, error } = await supabase.auth.admin.deleteUser(UserProp);
        if (error) throw error;
        console.log("User deleted successfully", data);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };
  
    return (
      <Box>
        <Button sx={{ color: "red" }} onClick={handleDeleteUser}>
          アカウントを削除する
        </Button>
      </Box>
    );
  };
  
  export default DeleteUser;