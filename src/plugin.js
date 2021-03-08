import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronLeft, faPlus, faMinus, faExpand, faCompress, faShare, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faLinkedinIn, faPinterestP, faTwitter } from '@fortawesome/free-brands-svg-icons'

import PdfViewer from '@/components/PdfViewer.vue'

import VueSocialSharing from 'vue-social-sharing'

export default {
  install(Vue, options = {componentName: 'PdfViewer', sharingOptions: undefined}) {

    library.add(
      faChevronRight,
      faChevronLeft,
      faPlus, faMinus,
      faExpand,
      faCompress,
      faShare,
      faFacebookF,
      faLinkedinIn,
      faPinterestP,
      faTwitter,
      faEnvelope
    )

    Vue.use(VueSocialSharing, options.sharingOptions);

    Vue.component(options.componentName, PdfViewer)

  }
}