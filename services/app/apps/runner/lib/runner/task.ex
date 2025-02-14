defmodule Runner.Task do
  use Ecto.Schema

  import Ecto.Changeset

  alias Runner.AtomizedMap

  @derive Jason.Encoder

  @type t :: %__MODULE__{}

  @fields [:comment, :input_signature, :output_signature, :asserts, :asserts_examples]
  @primary_key false
  embedded_schema do
    field(:comment, :string, default: "use stdout to debug")
    field(:input_signature, {:array, AtomizedMap}, default: [])
    field(:output_signature, AtomizedMap, default: %{})
    field(:asserts, {:array, AtomizedMap}, default: [])
    field(:asserts_examples, {:array, AtomizedMap}, default: [])
  end

  @spec new!(params :: map()) :: t()
  def new!(params = %_{}), do: params |> Map.from_struct() |> new!()

  def new!(params = %{}) do
    %__MODULE__{}
    |> cast(params, @fields)
    |> validate_required(@fields)
    |> apply_action!(:validate)
  end
end
