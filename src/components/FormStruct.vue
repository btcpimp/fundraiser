<template>
  <form :class="cssClass" v-on:submit.prevent.default="submit">
    <div class="ni-form-container">
      <slot name="overlay"></slot>
      <header class="ni-form-header">
        <div class="ni-form-suptitle"><slot name="suptitle"></slot></div>
        <div class="ni-form-title"><slot name="title"></slot></div>
        <div class="ni-form-subtitle"><slot name="subtitle"></slot></div>
      </header>
      <main class="ni-form-main">
        <slot></slot>
      </main>
      <footer class="ni-form-footer">
        <slot name="reset"><div></div></slot>
        <slot name="submit"></slot>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ni-form',
  computed: {
    cssClass () {
      let value = 'ni-form'
      if (this.width === 'narrow') value += ' ni-form-narrow'
      return value
    }
  },
  props: ['width', 'submit']
}
</script>

<style lang="stylus">
@import '../styles/variables.styl'

.ni-forms, .ni-form
  padding 0.25rem

.ni-form
  max-width 40rem
  display flex

  &.ni-form-narrow
    max-width 21.333rem

.ni-form-container
  flex 1
  background c-app-fg
  display flex
  flex-flow column
  position relative
  shadow()

.ni-form-header, .ni-form-footer
  padding 1rem

.ni-form-main
  flex 1
  border-bottom 1px solid bc
  p
    font-size 0.875rem

.ni-form-footer
  display flex

.ni-form-header
  border-bottom 1px solid bc

.ni-form-subtitle
  color dim
  font-size 0.875rem

.ni-form-title
  font-weight 500

.ni-form-footer
  display flex
  justify-content space-between
  align-items center

@media screen and (min-width: 360px)
  .ni-form-title
    font-size 1.125rem

  .ni-form-header, .ni-form-footer
    padding-left 1.5rem
    padding-right 1.5rem

  .ni-form-title
    font-size 1.25rem

@media screen and (min-width: 768px)
  .ni-forms, .ni-form
    padding 0.333rem

  .ni-form-header, .ni-form-footer
    padding-top 1.5rem
    padding-bottom 1.5rem

  .ni-form-title
    margin-bottom 0.5rem
    font-size 1.5rem
    font-weight bold

  .ni-form-subtitle
    font-size 1rem
    color txt

@media screen and (min-width: 1024px)
  .ni-forms, .ni-form
    padding 0.5rem
</style>
