<script lang="ts">
  type Props = {
    color: string;
  };

  let { color }: Props = $props();
</script>

<div style:--background-color={color}></div>

<style>
  div {
    background-color: var(--background-color);
    height: 7rem;
    width: 6rem;
    border-radius: 4px;
  }
</style>
