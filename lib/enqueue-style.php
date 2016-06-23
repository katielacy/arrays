<?php
/**
 * Proper way to enqueue scripts and styles
 */
function queue_styles() {
  wp_enqueue_style( 'font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css' );
  wp_enqueue_style( 'bootstrap', 'https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css' );
  wp_enqueue_style( 'main', THEME.'/assets/css/main.min.css' );
}
add_action( 'wp_enqueue_scripts', 'queue_styles' );