Feature: World Visualizer
  As a world builder
  I want to graphically and interactively visualize my virtual world
  In order to ensure the world is coming together how I want

  Background:
    Given I am on the builder page

  Scenario: Zoom in
    When I scroll up inside the world visualizer
    Then I see the world zoom in

  Scenario: Zoom out
    When I scroll down inside the world visualizer
    Then I see the world zoom out
