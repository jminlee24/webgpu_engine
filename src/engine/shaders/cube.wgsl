struct Uniforms{
  viewProjection : mat4x4f,
};

struct VSOutput{
  @builtin(position) position : vec4f,
  @location(0) texCoord : vec2f,
};

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var ourSampler: sampler;
@group(0) @binding(2) var ourTexture: texture_2d<f32>;

@vertex fn vs(
  @location(0) position : vec3f
) -> VSOutput {

  var vsout : VSOutput;

  vsout.position = uniforms.viewProjection * vec4f(position.xyz, 1.0);

  vsout.texCoord = vec2f(position.x, 1.0 - position.y);

  return vsout;
}

@fragment fn fs(
vs : VSOutput
) -> @location(0) vec4f {
  return textureSample(ourTexture, ourSampler, vs.texCoord);
}
