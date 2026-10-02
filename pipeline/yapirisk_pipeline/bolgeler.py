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
    #: O noktalarda ölçülen SS_ESHM20 / SS_TDTH oranının en küçüğü ve en büyüğü (dışa yuvarlanmış); None = ölçülmedi.
    tdth_oran: tuple[float, float] | None = None


BOLGELER = {
    "aydin": Bolge(
        kimlik="aydin",
        ad="Aydın",
        osm_iliski=223166,
        merkez=(27.85, 37.8),
        yakinlik=8.5,
        tdth_nokta=10,
        tdth_oran=(0.52, 0.97),
    ),
    "denizli": Bolge(
        kimlik="denizli",
        ad="Denizli",
        osm_iliski=223169,
        merkez=(29.3, 37.65),
        yakinlik=8.5,
        tdth_nokta=10,
        tdth_oran=(0.75, 1.14),
    ),
    "izmir": Bolge(
        kimlik="izmir",
        ad="İzmir",
        osm_iliski=223167,
        merkez=(27.25, 38.45),
        yakinlik=8.5,
        tdth_nokta=10,
        tdth_oran=(0.80, 1.34),
    ),
    "manisa": Bolge(
        kimlik="manisa",
        ad="Manisa",
        osm_iliski=223168,
        merkez=(27.9, 38.75),
        yakinlik=8.5,
        tdth_nokta=10,
        tdth_oran=(0.72, 1.25),
    ),
}
