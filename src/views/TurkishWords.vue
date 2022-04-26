<template>
  <div>
    <h1>Turkish</h1>
    <pre>{{ekmek}}</pre>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from "vue";

  const getWord = async (word: string) => {

    const response = await fetch(`https://sozluk.gov.tr/gts?ara=${word}`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
      },
      method: "GET",
    });
    const body = await response.json() as SozlukResponseItem[];
    return body;
  }

  let ekmek: any[] = reactive([]);

  getWord('ekmek').then((data: any[]) => {
    data.map(item => ekmek.push(item))
  })

  interface SozlukMadde {
    madde_id: string,
    madde: string,
    on_taki?: string,
  }

  interface SozlukYazar {
    yazar_id: string,
    tam_adi: string,
    kisa_adi: string,
    ekno: string,
  }

  interface SozlukOrnekler {
    ornek_id: string,
    anlam_id: string,
    ornek_sira: string,
    ornek: string,
    kac: string,
    yazar_id: string,
    yazar: SozlukYazar[],
  }

  interface SozlukOzellikler {
    ozellik_id: string,
    tur: string,
    tam_adi: string,
    kisa_adi: string,
    ekno: string,
  }

  interface SozlukAnlam {
    anlam_id: string,
    madde_id: string,
    anlam_sira: string,
    fiil: string,
    tipkes: string,
    anlam: string,
    gos: string,
    orneklerListe: SozlukOrnekler[],
    ozelliklerListe: SozlukOzellikler[]
  }

  interface SozlukResponseItem {
    madde_id: string,
    kac: string,
    kelime_no: string,
    cesit: string,
    anlam_gor: string,
    on_taki?: string,
    madde: string,
    cesit_say: string,
    anlam_say: string,
    taki: string,
    cogul_mu: string,
    ozel_mi: string,
    lisan_kodu: string,
    lisan: string,
    telaffuz?: string,
    birlesikler: string,
    font?: string,
    madde_duz: string,
    gosterim_tarihi?: string,
    anlamlarListe: SozlukAnlam[],
    atasozu: SozlukMadde[],
  }
</script>
