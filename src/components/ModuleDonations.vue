<template>
  <module class="module-donations">
    <module-overlay slot="overlay" v-if="!fundraiserActive"></module-overlay>
    <div slot="title">Donation History</div>
    <div class="md-sections">
      <section>
        <p>View the history of Bitcoin donations on Blockchain (blockchain.info):</p>
        <btn
          icon="external-link"
          @click.native="viewBtcDonations"
          value="BTC Donations">
        </btn>
      </section>
      <section>
        <p>View the history of Ether donations on Etherscan (etherscan.io):</p>
        <btn
          icon="external-link"
          @click.native="viewEthDonations"
          value="ETH Donations">
        </btn>
      </section>
    </div>
    </div>
  </module>
</template>

<script>
import { mapGetters } from 'vuex'
import cfr from 'cosmos-fundraiser'
import Module from './Module'
import ModuleOverlay from './ModuleOverlay'
import Btn from '@nylira/vue-button'
export default {
  name: 'module-donations',
  components: {
    Btn,
    Module,
    ModuleOverlay
  },
  computed: {
    fundraiserActive () {
      console.log('started/ended', this.fundraiserStarted, this.fundraiserEnded)
      return this.fundraiserStarted && !this.fundraiserEnded
    },
    ...mapGetters(['config', 'donations', 'fundraiserEnded'])
  },
  data: () => ({
    fundraiserStarted: false,
    details: true
  }),
  methods: {
    viewBtcDonations () {
      window.location.href =
        'https://blockchain.info/address/15ZcBgrLnjXsHGCv7iiVcxhCf9xK9xQu4B'
    },
    viewEthDonations () {
      window.location.href =
        'https://etherscan.io/address/0xa4028F2aec0ad18964e368338E5268FebB4F5423'
    },
    watchFundraiserStart () {
      let self = this
      cfr.ethereum.fetchIsActive('', function (err, res) {
        if (err) return
        if (res === 1) self.fundraiserStarted = true
        else self.fundraiserStarted = false
        // console.log('this.fundraiserStarted', self.fundraiserStarted)
      })
    }
  },
  mounted () {
    this.watchFundraiserStart()
    setInterval(() => this.watchFundraiserStart(), 1000)
  }
}
</script>

<style lang="stylus">
@import '../styles/variables.styl'

.md-sections
  display flex
  flex-flow column nowrap
  section
    flex 1
    border-bottom 1px solid bc
    padding 1rem
    display flex
    flex-flow column nowrap
    justify-content center
    p
      margin-bottom 1rem
      font-size 0.875rem
      color dim
    .ni-btn-wrapper
      max-width 20rem
      margin 0 auto
    &:last-of-type
      border none

@media screen and (min-width: 768px)
  .md-sections
    flex-flow row nowrap
    section
      border-bottom none
      border-right 1px solid bc
      padding 1.5rem 3rem
      p
        font-size 1rem
        text-align center
        max-width 20rem
        margin 0 auto 1rem
</style>
