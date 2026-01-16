import Head from "next/head";
import axios from "axios";
import HomePage from "../Components/Front/HomePage";

const Home = ({ data }) => {
  return (
    <>
      <Head>
        <title>{data?.seo?.title}</title>
        <meta name="description" content={data?.seo?.metaDesc} />
      </Head>
      <HomePage pageData={data} />
    </>
  );
};

export async function getServerSideProps({ req }) {
  const { host } = req.headers;
  const data = await axios
    .get(`http://${host}/api/home-page`)
    .then((res) => res.data);

  return {
    props: {
      data,
    },
  };
}
export default Home;
