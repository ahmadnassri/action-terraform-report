# GitHub Action: Terraform Pull Request Report Generator

[![license][license-img]][license-url]
[![version][version-img]][version-url]
[![super linter][super-linter-img]][super-linter-url]
[![release][release-img]][release-url]

[license-url]: LICENSE
[license-img]: https://badgen.net/github/license/ahmadnassri/action-terraform-report

[version-url]: https://github.com/ahmadnassri/action-terraform-report/releases
[version-img]: https://badgen.net//github/release/ahmadnassri/action-terraform-report

[super-linter-url]: https://github.com/ahmadnassri/action-terraform-report/actions?query=workflow%3Asuper-linter
[super-linter-img]: https://github.com/ahmadnassri/action-terraform-report/workflows/super-linter/badge.svg

[release-url]: https://github.com/ahmadnassri/action-terraform-report/actions?query=workflow%3Arelease
[release-img]: https://github.com/ahmadnassri/action-terraform-report/workflows/release/badge.svg

Updates Pull Requests with visual diff of Terraform Plan changes

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
      - run: terraform init
      - run: terraform validate
      - run: terraform plan -lock=false -out terraform.plan
      - run: terraform show -json terraform.plan
        id: show
      # store output into a file
      - run: |
          cat > terraform.json << 'EOM'
          ${{ steps.show.outputs.stdout }}
          EOM

      - uses: ahmadnassri/action-terraform-report@v1
        with:
          # tell the action where to find the json file
          terraform-plan: ${{ github.workspace }}/terraform.json
```

### Inputs

| input            | required | default        | description                                                   |
| ---------------- | -------- | -------------- | ------------------------------------------------------------- |
| `terraform-plan` | ✔        | `-`            | path to [Terraform JSON] file generated with `terraform show` |
| `github-token`   | ❌       | `github.token` | The GitHub token used to update the pull-request              |

[Terraform JSON]: https://www.terraform.io/docs/configuration/syntax-json.html
