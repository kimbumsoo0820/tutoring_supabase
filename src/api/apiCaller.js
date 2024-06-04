import supabase from "../supabase/supabaseClient";

const post = {
  getPostData: async () => {
    try {
      const { data, error } = await supabase.from("posts").select();
      if (error) {
        console.error("에러 발생", error);
      } else {
        console.log("apiCall userData :", data);
        return data || null;
      }
    } catch (e) {
      window.alert("get post api error", e);
      return false;
    }
  },
  writePost: async ({ id, postTitle, postContent }) => {
    try {
      if (!id) {
        return window.alert("먼저 로그인하세요.");
      }
      if (postTitle === "" || postContent === "") {
        return window.alert("내용을 모두 입력해주세요.");
      }
      const { data, error } = await supabase.from("posts").insert(
        {
          user_id: id,
          title: postTitle,
          content: postContent,
        },
        { returning: "representation" }
      );
      if (error) {
        return false;
      } else {
        return data;
      }
    } catch (e) {
      console.log("wirte post api error", e);
      return false;
    }
  },
};

const user = {
  setUserData: async ({ id }) => {
    const { data, error } = await supabase.from("user").insert({ id });
    if (error) {
      window.alert("에러 발생", error);
      return Boolean(false);
    } else {
      console.log("apiCall success");
      return Boolean(true);
    }
  },

  signUp: async ({ userEmail, userPassword }) => {
    const { data, error } = await supabase.auth.signUp({
      email: userEmail,
      password: userPassword,
    });
    if (error) {
      window.alert("에러 발생", error);
      return Boolean(false);
    } else {
      console.log("signUp success", data);
      return data;
    }
  },

  signIn: async ({ userSignInEmail, userSignInPassword }) => {
    console.log("api login ", userSignInEmail, userSignInPassword);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userSignInEmail,
      password: userSignInPassword,
    });
    if (error) {
      window.alert("에러 발생", error);
      return Boolean(false);
    } else {
      console.log("signIn success", data);
      return data;
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert("에러 발생", error);
      return Boolean(false);
    } else {
      return true;
    }
  },

  checkSignIn: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return false;
      }
      return data;
    } catch (e) {
      return false;
    }
  },
};

const apiCaller = {
  post,
  user,
};

export default apiCaller;
