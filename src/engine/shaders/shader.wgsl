struct Uniforms{ 
  viewProjection: mat4x4f, 
  world: mat4x4f
};

struct VSOutput{
  @builtin(position) position: vec4f,
  @location(0) texCoord: vec2f,
};

@group(0) @binding(0) var<uniform> uni: Uniforms;
 
@vertex fn vs(
  @location(0) position: vec4f
) -> VSOutput {

  var vsout: VSOutput;
  vsout.position = uni.viewProjection * vec4f(position.xyz, 1.0);
  vsout.texCoord = position.xy * 2 - 1;

  return vsout;
}

@fragment fn fs() -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 1.0, 1.0);
}
