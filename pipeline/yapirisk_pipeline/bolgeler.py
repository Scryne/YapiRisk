"""Bölge tanımları (K-3): kod il bilmez, yeni il = buraya bir kayıt + boru hattını çalıştırmak."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Bolge:
    kimlik: str
    ad: str
    #: OSM il sınırı ilişkisi (boundary=administrative, admin_level=4).
    osm_iliski: int
    #: Harita açılışı: [boylam, enlem], yakınlık.
    merkez: tuple[float, float]
    yakinlik: float
    #: Bu ilde ESHM20'nin AFAD TDTH ile karşılaştırıldığı nokta sayısı (spike/S1); 0 = ölçülmedi.
    tdth_nokta: int = 0


BOLGELER = {
    "izmir": Bolge(
        kimlik="izmir", ad="İzmir", osm_iliski=223167, merkez=(27.25, 38.45), yakinlik=8.5, tdth_nokta=10
    ),
    "manisa": Bolge(
        kimlik="manisa", ad="Manisa", osm_iliski=223168, merkez=(27.9, 38.75), yakinlik=8.5, tdth_nokta=10
    ),
}
