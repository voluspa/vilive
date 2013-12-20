defmodule ExmudWeb.Mixfile do
  use Mix.Project

  def project do
    [ app: :exmud_web,
      version: "0.0.1",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 0.11.2",
      erlc_options: [parse_transform: :lager_transform],
      deps: deps ]
  end

  # Configuration for the OTP application
  def application do
    [
      description: "Web front end for Exmud's world builder, game client, and main site",
      mod: { ExmudWeb, [] },
      env: [
      ]
    ]
  end

  # Returns the list of dependencies in the format:
  # { :foobar, git: "https://github.com/elixir-lang/foobar.git", tag: "0.1" }
  #
  # To specify particular versions, regardless of the tag, do:
  # { :barbat, "~> 0.1", github: "elixir-lang/barbat.git" }
  #
  # You can depend on another app in the same umbrella with:
  # { :other, in_umbrella: true }
  defp deps do
    [
      { :cowboy, "~> 0.9", github: "extend/cowboy" },
      { :lager, "~> 2.0", github: "basho/lager" }
    ]
  end
end
