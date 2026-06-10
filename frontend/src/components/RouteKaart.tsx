// Statische routekaart voor de Patagonië-reis (Puerto Montt → Stanley)
export default function RouteKaart() {
  return (
    <div className="w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-groen/20">
      <iframe
        title="Patagonië route"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '320px' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3Kuo&origin=Puerto+Montt,Chile&destination=Stanley,Falkland+Islands&waypoints=Parque+Pumalin,Chile|Puyuhuapi,Chile|Villa+Cerro+Castillo,Chile|El+Chalten,Argentina|Ushuaia,Argentina&mode=driving"
      />
    </div>
  );
}
