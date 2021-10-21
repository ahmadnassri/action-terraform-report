## Usage

```yaml
name: terraform-plan

on:
  pull_request:

jobs:
  terraform-plan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: hashicorp/setup-terraform@v1
        with:
          terraform_wrapper: false

      - run: terraform init
      - run: terraform plan -lock=false -out terraform.plan

      # generate plain output
      - run: terraform show -no-color terraform.plan > terraform.text

      # generate json output
      - run: terraform show -json terraform.plan > terraform.json

      - uses: ahmadnassri/action-terraform-report@v2
        with:
          # tell the action the plan outputs
          terraform-text: ${{ github.workspace }}/terraform.text
          terraform-json: ${{ github.workspace }}/terraform.json
```

> **Note**: Ensure `terraform_wrapper` is set to `false` to better capture the output into a file _(or use your own method)_

### Inputs

| input            | required | default        | description                                                                        |
| ---------------- | -------- | -------------- | ---------------------------------------------------------------------------------- |
| `terraform-text` | ✔        | `-`            | path to the file resulting from the output of `terraform show /path/to/plan`       |
| `terraform-json` | ✔        | `-`            | path to the file resulting from the output of `terraform show -json /path/to/plan` |
| `github-token`   | ❌        | `github.token` | The GitHub token used to post comments on pull requests                            |
| `show-plan`      | ❌        | `true`         | include the terraform plan view in the final output?                               |
| `show-diff`      | ❌        | `false`        | include the diff view in the final output?                                         |

## Examples

| Pull Request Comment _(default)_ |
| ---------------------------------| 
| ![](./docs/1.png)                |

| Pull Request Comment _(Plan)_ |
| ------------------------------| 
| ![](./docs/2.png)             |

| Pull Request Comment _(Diff)_ |
| ------------------------------| 
| ![](./docs/3.png)             |
