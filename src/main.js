import '@/assets/styles/index.scss';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronLeft, faPlus, faMinus, faExpand, faCompress, faShare, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faLinkedinIn, faPinterestP, faTwitter } from '@fortawesome/free-brands-svg-icons'

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

import PdfViewer from '@/components/PdfViewer.vue'

export { 
  PdfViewer
}
