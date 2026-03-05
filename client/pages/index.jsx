import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  try {
    const { data } = await buildClient(context).get("/api/users/currentuser");
    return data;
  } catch (err) {
    console.error("[index] currentuser fetch failed:", err.message);
    return { currentUser: null };
  }
};

export default LandingPage;
