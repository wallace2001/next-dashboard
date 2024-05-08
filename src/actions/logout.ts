
export const logoutUser = async (accessToken: string, refreshToken: string) => {
    try {
        const headers = {
            "content-type": "application/json",
            "access_token": accessToken,
            "refresh_token": refreshToken,
          };
      
          const requestBody = {
            query: `query {
              getLoggedInUser {
                user {
                  id
                  name
                  email
                  avatar {
                    url
                  }
                  address
                  password
                }
                accessToken
                refreshToken
              }
            }`,
          };

          const options = {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
          };
      
          await (
            await fetch(process.env.NEXT_PUBLIC_SERVER_URI!, options)
          ).json();
    } catch (err) {
        console.log("ERROR DURING FETCH REQUEST", err);
    }
};