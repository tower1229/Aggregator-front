import { defineComponent } from 'vue'
import './style.css'

export default defineComponent({
  name: 'Loading',
  setup(props) {
    return {}
  },
  render() {
    return (
      <div class="-mt-12.5 -ml-12.5 top-[50%] left-[50%] z-10 customLoading absolute">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
  }
})
