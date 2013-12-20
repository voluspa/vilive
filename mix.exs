defmodule Exmud.Mixfile do
  use Mix.Project

  def project do
    [ apps_path: "apps",
      deps: deps ]
  end

  # Returns the list of dependencies in the format:
  # { :foobar, git: "https://github.com/elixir-lang/foobar.git", tag: "0.1" }
  #
  # To specify particular versions, regardless of the tag, do:
  # { :barbat, "~> 0.1", github: "elixir-lang/barbat.git" }
  #
  # These dependencies are not accessible from child applications
  defp deps do
    []
  end
end
