import cookie from "cookiejs";

export const uploadImage = async (file: any) => {
    try {  
        const headers = new Headers();
        headers.append('access_token', cookie.get('access_token') as any);
        headers.append('refresh_token', cookie.get('refresh_token') as any);
        const formData = new FormData();
        formData.append("file", file);

      const options = {
        method: "POST",
        headers,
        body: formData,
      };
      const response = await (
        await fetch(process.env.NEXT_PUBLIC_SERVER_UPLOAD_IMAGE!, options)
      ).json();
  
      return response;
    } catch (err) {
      console.log("ERROR DURING FETCH REQUEST", err);
    }
  };
  