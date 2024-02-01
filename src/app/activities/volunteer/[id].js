import { useRouter } from "next/router";

const Volunteer = () => {
  const router = useRouter();
  return <p>Post: {router.query.id}</p>;
};

export default Volunteer;
