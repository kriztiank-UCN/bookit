import RoomCard from "@/components/RoomCard";
import Heading from "@/components/Heading";
import rooms from "@/data/rooms";

export default function Home() {
  return (
    <>
      <Heading title="Available Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} key={room.$id} />)
      ) : (
        <p>No rooms available at the moment</p>
      )}
    </>
  );
}
