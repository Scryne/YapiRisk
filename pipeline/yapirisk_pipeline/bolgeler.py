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


BOLGELER = {
    "manisa": Bolge(kimlik="manisa", ad="Manisa", osm_iliski=223168, merkez=(27.9, 38.75), yakinlik=8.5),
}
