defmodule ExmudWeb do
  use Application.Behaviour
  alias ExmudWeb.Handlers

  # See http://elixir-lang.org/docs/stable/Application.Behaviour.html
  # for more information on OTP Applications
  def start(_type, _args) do
    Enum.each([
      :crypto,
      :compiler,
      :syntax_tools,
      :goldrush,
      :lager,
      :cowlib,
      :ranch,
      :cowboy
    ], &maybe_start/1)

    dispatch = :cowboy_router.compile([
      {:_, [
        {"/static/[...]", :cowboy_static, {:priv_dir, :exmud_web, "static"}},
        {"/builder", :cowboy_static, {:priv_file, :exmud_web, "static/builder.html"} }
      ]}
    ])

    :cowboy.start_http(:exmud_http_listener, 100,
      [{:port, 8080}],
      [{:env, [{:dispatch, dispatch}]}]
    )
  end

  defp maybe_start(app) do
    case :application.start(app) do
      :ok -> :ok
      {:error, {:already_started, ^app}} -> :ok
    end
  end
end
