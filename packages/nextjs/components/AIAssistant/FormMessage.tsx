export default function FormMessage() {
  return (
    <div className="bg-white flex p-4 rounded-b-lg">
      <input
        className="bg-white outline-none px-3 flex-1 text-[#000]"
        placeholder="Ex: Transfer 100 USDT to address “0xd3j4333nejkjd87f76aa88vg9b”"
      />
      <p className="cursor-pointer button-bg px-6 py-2.5 rounded-lg">Start</p>
    </div>
  );
}
