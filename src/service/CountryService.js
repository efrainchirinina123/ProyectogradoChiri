export class CountryService {
    getCountries() {
        return fetch('/demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
export default {
  data() {
    return {
      layoutConfig: {
        darkTheme: {
          value: false // valor inicial
        }
      }
    };
  },
  methods: {
    onDarkModeChange(currentValue) {
      this.layoutConfig.darkTheme.value = !currentValue;
      // Aquí puedes agregar más lógica, por ejemplo, guardar la preferencia en localStorage o hacer cualquier otra cosa que necesites
    }
  }
}
